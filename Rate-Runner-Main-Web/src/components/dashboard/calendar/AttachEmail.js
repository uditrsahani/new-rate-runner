import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { addMinutes } from 'date-fns';
import { Formik } from 'formik';
import FileDropzone from '../../FileDropzone';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  Grid
} from '@material-ui/core';
// import { createEvent, updateEvent } from '../../../slices/calendar';
// import { useDispatch } from '../../../store';
import instance from '../../../store/instance';

const getInitialValues = (event, range) => {
  if (event) {
    return {
      allDay: event.allDay || false,
      color: event.color || '',
      description: event.description || '',
      end: event.end ? new Date(event.end) : addMinutes(new Date(), 30),
      start: event.start ? new Date(event.start) : new Date(),
      title: event.title || '',
      submit: null
    };
  }

  if (range) {
    return {
      allDay: false,
      color: '',
      description: '',
      end: new Date(range.end),
      start: new Date(range.start),
      title: '',
      submit: null
    };
  }

  return {
    allDay: false,
    color: '',
    description: '',
    end: addMinutes(new Date(), 30),
    start: new Date(),
    title: '',
    submit: null
  };
};

const AttachEmail = (props) => {
  const { event, range, FormID } = props;
  console.log(FormID);
  const [files, setFiles] = useState([]);
  const handleDrop = (newFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleRemove = (file) => {
    setFiles((prevFiles) => prevFiles.filter((_file) => _file.path !== file.path));
  };

  const handleRemoveAll = () => {
    setFiles([]);
  };

  return (
    <Formik
      initialValues={getInitialValues(event, range)}
      onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }) => {
        try {
          const formData = new FormData();
          formData.append('file', files[0]);

          const config = {
            headers: {
              'content-type': 'multipart/form-data'
            }
          };
          await instance.post(`agent/quote/${FormID.aq_id}/file`, formData, config)
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });

          /* if (event) {
            await dispatch(updateEvent(event.id, data));
          } else {
            await dispatch(createEvent(data));
          } */

          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
          toast.success('Uploaded');
          window.location.assign(`/main/Recommend/details/${FormID.aq_inq_no}`);

          /* if (!event && onAddComplete) {
            onAddComplete();
          }

          if (event && onEditComplete) {
            onEditComplete();
          } */
        } catch (err) {
          console.error(err.response);
          toast.error('Something went wrong!');
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        handleSubmit, isSubmitting
      }) => (
        <form onSubmit={handleSubmit}>
          <Box sx={{ mt: 3 }}>
            <Card>
              <CardHeader title="Upload File" />
              <CardContent>
                <FileDropzone
                  name="file"
                  accept=".eml,.msg"
                  files={files}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                />
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="flex-end"
                >
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2 }}
                  >
                    Upload
                  </Button>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </form>
      )}
    </Formik>
  );
};

AttachEmail.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  FormID: PropTypes.object
};

export default AttachEmail;
