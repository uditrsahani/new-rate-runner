import FormData from "form-data";
import { InternalServerError } from "routing-controllers";
import { Inject, Service } from "typedi";
import { MailFormRequest } from "../models/MailFormRequest";
import DotEnv from "dotenv";
import { AxiosFactoryConnection, IAxiosConnection } from "app/core/IAxiosConnection";
import { IUserRepository, UserRepository } from "app/modules/auth/repositories/IUserRepository";
import { UserAccount } from "app/modules/auth/models/UserAccount";
import { MailSendError } from "../error/MailSendError";
import { InquiryService } from "app/modules/inquiry/services/InquiryService";
import { InquiryQueryParam } from "app/modules/inquiry/models/InquiryQueryParam";
import { UserAccountQueryParam } from "app/modules/auth/models/UserAccountQueryParam";
import { ContactService } from "app/modules/contact/services/ContactService";
import { ContactQueryParam } from "app/modules/contact/models/ContactQueryParam";
import { LogMail } from "app/modules/logs/models/LogMail";
DotEnv.config();

@Service()
export class MailService {

    @Inject(AxiosFactoryConnection)
    private axiosFactory: IAxiosConnection
    private target: string = "mail";

    @Inject(UserRepository)
    private userRepository: IUserRepository;

    @Inject(() => ContactService)
    private contactService: ContactService;

    @Inject(() => InquiryService)
    private inquiryService: InquiryService;

    private getConnection() {
        const connection = this.axiosFactory.create(this.target);
        return connection;
    }

    private async mailSend(token: string, mailFrom: MailFormRequest) {
        const bodyFormData = new FormData();
        bodyFormData.append('from', 'Rate Runner <raterunner@wice.co.th>');
        bodyFormData.append('to', mailFrom.to);
        bodyFormData.append('cc', mailFrom.cc);
        bodyFormData.append('subject', mailFrom.subject);
        bodyFormData.append('html', mailFrom.html);

        const formHeaders = bodyFormData.getHeaders();
        const config = {
            headers: {
                ...formHeaders,
                'Authorization': token
            }
        }

        try{    
            const mail = await this.getConnection()
                .post<void>(`/mail/text`, bodyFormData, config);
            return mail;
        }catch(error){
            console.log(error);
            throw new InternalServerError("Mail error");
        }
    }

    private async mailAndFileSend(token: string, mailFrom: MailFormRequest, file: any) {
        const xlsx_config = {
            filename: `Document.pdf`,
            contentType: 'application/pdf', 
            knownLength: 19806
        }
        const buffers: Buffer[] = [];

        file.on('data', buffers.push.bind(buffers));
        file.on('end', async () => {
            try{  
                const pdfBuffer = Buffer.concat(buffers)
                const bodyFormData = new FormData();
                bodyFormData.append('from', 'Rate Runner <raterunner@wice.co.th>');
                bodyFormData.append('to', mailFrom.to);
                bodyFormData.append('cc', mailFrom.cc);
                bodyFormData.append('subject', mailFrom.subject);
                bodyFormData.append('html', mailFrom.html);
                bodyFormData.append('file', pdfBuffer, xlsx_config);

                const formHeaders = bodyFormData.getHeaders();
                const config = {
                    headers: {
                        ...formHeaders,
                        'Authorization': token
                    }
                }

                const mail = await this.getConnection()
                    .post<void>(`/mail/file`, bodyFormData, config);
                return mail;
            }catch(error){
                console.log(error);
                throw new InternalServerError("Mail error");
            }
        });
    }

    public async sendRawMail(token: string, user: UserAccount, log_mail: LogMail) {
        const mailFrom: MailFormRequest = new MailFormRequest();
        mailFrom.to = log_mail.to_mail.join(',');
        mailFrom.cc = log_mail.to_cc.join(',');
        mailFrom.subject = log_mail.subject;
        mailFrom.html = log_mail.html;

        const mail = await this.mailSend(token, mailFrom);
        return mail;
    }

    //Mail Text
    public async notiAgentInquiry(token: string, user: UserAccount, agent_id: string, inq_uuid: string){
        const user_param = new UserAccountQueryParam();
        user_param.user_id = user.user_id;
        const contact_param = new ContactQueryParam();
        contact_param.ct_refer_table = "agent";
        contact_param.ct_refer_id = agent_id;
        const contacts = await this.contactService.getContact(contact_param);
        const inquiry_param = new InquiryQueryParam();
        inquiry_param.inq_uuid = inq_uuid;
        const inquiry: any = await this.inquiryService.getInquiry(inquiry_param, user);
        const mailFrom: MailFormRequest = new MailFormRequest();
        const email_to_send: string[] = [];
        contacts.forEach((contact) => {
            if(contact.ct_mail) {
                email_to_send.push(contact.ct_mail);
                console.log("send_mail: ", contact.ct_mail);
            }
        });
        mailFrom.to = email_to_send.join(',');
        mailFrom.cc = '';
        mailFrom.subject = `WICE Inquiry under ${inquiry[0].inq_incoterms} from ${inquiry[0].pol_port_name} to ${inquiry[0].pod_port_name} // ${inquiry[0].inq_no}`;
        mailFrom.html = `<p>Dear sirs,<br>
                            Good day to you.<br>
                            We would ask you to provide cost for our inquiry as below details:-<br>
                         </p>
                         <p>
                            Term:&nbsp;&nbsp;&nbsp;&nbsp;                       ${inquiry[0].inq_incoterms}<br>
                            Port of Loading (POL):&nbsp;&nbsp;&nbsp;&nbsp;      ${inquiry[0].pol_port_name}<br>
                            Port Of Destination (POD):&nbsp;&nbsp;&nbsp;&nbsp;	${inquiry[0].pod_port_name}<br>
                            Pick-up Location: &nbsp;&nbsp;&nbsp;&nbsp;          ${inquiry[0].inq_pickup_location}<br>
                            Volume<br>
                            &nbsp;&nbsp;20:&nbsp;&nbsp;&nbsp;&nbsp;             ${inquiry[0].inq_container_20}<br>
                            &nbsp;&nbsp;40:&nbsp;&nbsp;&nbsp;&nbsp;             ${inquiry[0].inq_container_40}<br>
                            &nbsp;&nbsp;40&nbsp;hc:&nbsp;&nbsp;&nbsp;&nbsp;     ${inquiry[0].inq_container_40hc}<br>
                            Commodity:&nbsp;&nbsp;&nbsp;&nbsp;			        ${inquiry[0].inq_commodity}<br>
                            GW Per CNTR (Kg):&nbsp;&nbsp;&nbsp;&nbsp;		    ${inquiry[0].inq_qw_per_cntr}<br>
                            Comment:&nbsp;&nbsp;&nbsp;&nbsp;			        ${inquiry[0].inq_other}<br>
                          </p>
                        <p>
                            Looking forward to hearing feedback from you.<br>
                            Thank you so much.<br>
                            <br>
                            Best regards,<br>
                            <br>
                            ${user.user_fullname} | Marketing | Sales & Marketing <br>
                            ${user.user_mobile? `Tel : ${user.user_mobile} | ` : ""}Mobile : ${user.user_phone ? user.user_phone : ""} | E-mail : ${user.user_mail ? user.user_mail : ""}<br>
                            <br>
                            WICE Logistics PCL<br>
                            <br>
                        </p>`;

        const mail = await this.mailSend(token, mailFrom);
        return mail;
    }

    public async forgetPasswordMail(user_mail: string, user_password: string){
        const systemToken = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzYWxlc01Ad2ljZS5jby50aCIsInVzZXJfcm9sZSI6InNhbGVzTWFuYWdlciIsImlhdCI6MTYzMTQ2NjcyODg1MX0.j2q8FdFdGMeUWMstHF-qH39aXmx1oD1wdmHWx8D5x3g`;
        const mailFrom: MailFormRequest = new MailFormRequest();
        mailFrom.to = user_mail;
        mailFrom.cc = '';
        mailFrom.subject = `Rate runner forget password`;
        mailFrom.html = `<p>Your password is ${user_password}</p>
                         <p>Please change your password after login</p>`;

        const mail = await this.mailSend(systemToken, mailFrom);
        return mail;
    }

    //Mail File
    public async notiValidatePackage(caller: UserAccount,
                                    packages: any[],
                                    org_uuid: string) {
        const mailFrom: MailFormRequest = new MailFormRequest();
        mailFrom.to = ""
        mailFrom.subject = `Door-to-Door price`;
        let html_content = ``;

        packages.forEach((data, index) => {
            html_content += `${index + 1}. ${data.title}<br>`
        });

        mailFrom.html = html_content;
        const token = process.env.SYSTEM_TOKEN;
        try{
            const mail = await this.mailAndFileSend(token, mailFrom, null);
            return mail;
        }catch(error){
            console.log(error);
            throw new MailSendError();
        }
    }
}
