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
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
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

const CalendarEventForm = (props) => {
  const { event, range } = props;
  // const dispatch = useDispatch();
  const [duplicate, setDuplicate] = useState([]);
  const [files, setFiles] = useState([]);

  const handleDrop = (newFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleRemove = (file) => {
    setFiles((prevFiles) => prevFiles.filter((_file) => _file.path !== file.path));
    setDuplicate([]);
  };

  const handleRemoveAll = () => {
    setFiles([]);
    setDuplicate([]);
  };

  const setDisplay = (rate) => {
    let str = '';
    if (rate.duplicate) {
      str = 'duplicate';
    } else {
      if (!rate.cus_found && str === '') {
        str += 'Customer Not Found';
      }
      if (!rate.agent_found && str === '') {
        str += 'Agent Not Found';
      } else if (!rate.agent_found && str !== '') {
        str += ', Agent Not Found';
      }
      if (!rate.cr_found && str === '') {
        str += 'Carrier Not Found';
      } else if (!rate.cr_found && str !== '') {
        str += ', Carrier Not Found';
      }
      if (!rate.pol_found && str === '') {
        str += 'POL Not Found';
      } else if (!rate.pol_found && str !== '') {
        str += ', POL Not Found';
      }
      if (!rate.pod_found && str === '') {
        str += 'POD Not Found';
      } else if (!rate.pod_found && str !== '') {
        str += ', POD Not Found';
      }
    }
    return str;
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

          await instance.post('/table/rate/file', formData, config)
            .then((res) => {
              // console.log(res);
              setDuplicate(res.data);
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
          <Box>
            <Card>
              <CardHeader title="Upload File" />
              <CardContent>
                <FileDropzone
                  name="filexxx"
                  accept=".xlsx"
                  files={files}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                  sx={{ width: 200 }}
                />
                <Grid>
                  <Box
                    sx={{ maxWidth: '100%', width: 600, mt: -4 }}
                    display={(duplicate.length > 0) ? 'block' : 'none'}
                  >
                    <Typography
                      variant="h6"
                      sx={{ mb: 1 }}
                    >
                      Problem Detected
                    </Typography>
                    <Table
                      fullWidth
                      size="small"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            No.
                          </TableCell>
                          <TableCell>
                            Problem
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {duplicate
                          .map((RateTable) => (
                            <TableRow>
                              <TableCell align="left">
                                {RateTable.rate_input_no ? RateTable.rate_input_no : ''}
                              </TableCell>
                              <TableCell align="left">
                                {setDisplay(RateTable)}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </Box>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2, width: 150 }}
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

CalendarEventForm.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object
};

export default CalendarEventForm;
