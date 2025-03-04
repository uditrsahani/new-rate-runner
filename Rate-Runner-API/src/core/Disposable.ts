export interface IDisposable {
    readonly disposed: boolean;
    dispose(): Promise<void> | void;
}

export function using(...disposable: IDisposable[]) {
    return function<T>(action: (...disposable: IDisposable[]) => Promise<T> | T) {
        try {
            const actionExecute = action(...disposable);
            if (actionExecute instanceof Promise) {
                return new Promise<T>((resolve, reject) => {
                    actionExecute
                        .then((resolved) => resolve(resolved))
                        .catch((e) => reject(e))
                        .finally(() => {
                            for (const d of disposable) {
                                d.dispose();
                            }
                    });
                });
            }
            return actionExecute;
        } finally {
            for (const d of disposable) {
                d.dispose();
            }
        }
    };
}
