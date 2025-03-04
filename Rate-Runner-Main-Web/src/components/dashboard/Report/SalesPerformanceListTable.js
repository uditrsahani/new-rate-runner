import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import Scrollbar from '../../Scrollbar';

const SalesPerformanceListTable = (props) => {
  const { invoices, total, win, loss, pending, disable, ...other } = props;

  const paginatedProducts = invoices;

  return (
    <Card {...other}>
      <Scrollbar>
        <Box sx={{ minWidth: 1200 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Team
                </TableCell>
                <TableCell align="right">
                  No. Of Inquiry
                </TableCell>
                <TableCell align="right">
                  %
                </TableCell>
                <TableCell align="right">
                  Win
                </TableCell>
                <TableCell align="right">
                  Win%
                </TableCell>
                <TableCell align="right">
                  Loss
                </TableCell>
                <TableCell align="right">
                  Loss%
                </TableCell>
                <TableCell align="right">
                  Pending
                </TableCell>
                <TableCell align="right">
                  Pending%
                </TableCell>
                <TableCell align="right">
                  Disable
                </TableCell>
                <TableCell align="right">
                  Disable%
                </TableCell>
              </TableRow>
            </TableHead>
            {paginatedProducts.map((value) => (
              <TableBody>
                <TableRow style={{ backgroundColor: '#E9FBFF' }}>
                  <TableCell>
                    {value.head.user_team}
                  </TableCell>
                  <TableCell align="right">
                    {(value.head.count && Number(value.head.count) !== 0) ? Number(value.head.count).toLocaleString() : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(total && Number(total) !== 0) ? `${(Number(value.head.count / total) * 100).toFixed(2).toLocaleString()}%` : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.head.win && Number(value.head.win) !== 0) ? Number(value.head.win).toLocaleString() : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.head.count && Number(value.head.count) !== 0) ? `${(Number(value.head.win / value.head.count) * 100).toFixed(2).toLocaleString()}%` : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.head.loss && Number(value.head.loss) !== 0) ? Number(value.head.loss).toLocaleString() : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.head.count && Number(value.head.count) !== 0) ? `${(Number(value.head.loss / value.head.count) * 100).toFixed(2).toLocaleString()}%` : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.head.pending && Number(value.head.pending) !== 0) ? Number(value.head.pending).toLocaleString() : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.head.count && Number(value.head.count) !== 0) ? `${(Number(value.head.pending / value.head.count) * 100).toFixed(2).toLocaleString()}%` : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.head.disable && Number(value.head.disable) !== 0) ? Number(value.head.disable).toLocaleString() : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.head.count && Number(value.head.count) !== 0) ? `${(Number(value.head.disable / value.head.count) * 100).toFixed(2).toLocaleString()}%` : ''}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    Current
                  </TableCell>
                  <TableCell align="right">
                    {(value.current.count && Number(value.current.count) !== 0) ? Number(value.current.count).toLocaleString() : ''}
                  </TableCell>
                  <TableCell align="right" />
                  <TableCell align="right">
                    {(value.current.win && Number(value.current.win) !== 0) ? Number(value.current.win).toLocaleString() : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.current.count && Number(value.current.count) !== 0) ? `${(Number(value.current.win / value.current.count) * 100).toFixed(2).toLocaleString()}%` : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.current.loss && Number(value.current.loss) !== 0) ? Number(value.current.loss).toLocaleString() : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.current.count && Number(value.current.count) !== 0) ? `${(Number(value.current.loss / value.current.count) * 100).toFixed(2).toLocaleString()}%` : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.current.pending && Number(value.current.pending) !== 0) ? Number(value.current.pending).toLocaleString() : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.current.count && Number(value.current.count) !== 0) ? `${(Number(value.current.pending / value.current.count) * 100).toFixed(2).toLocaleString()}%` : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.current.disable && Number(value.current.disable) !== 0) ? Number(value.current.disable).toLocaleString() : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.current.count && Number(value.current.count) !== 0) ? `${(Number(value.current.disable / value.current.count) * 100).toFixed(2).toLocaleString()}%` : ''}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    Key
                  </TableCell>
                  <TableCell align="right">
                    {(value.key.count && Number(value.key.count) !== 0) ? Number(value.key.count).toLocaleString() : ''}
                  </TableCell>
                  <TableCell align="right" />
                  <TableCell align="right">
                    {(value.key.win && Number(value.key.win) !== 0) ? Number(value.key.win).toLocaleString() : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.key.count && Number(value.key.count) !== 0) ? `${(Number(value.key.win / value.key.count) * 100).toFixed(2).toLocaleString()}%` : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.key.loss && Number(value.key.loss) !== 0) ? Number(value.key.loss).toLocaleString() : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.key.count && Number(value.key.count) !== 0) ? `${(Number(value.key.loss / value.key.count) * 100).toFixed(2).toLocaleString()}%` : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.key.pending && Number(value.key.pending) !== 0) ? Number(value.key.pending).toLocaleString() : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.key.count && Number(value.key.count) !== 0) ? `${(Number(value.key.pending / value.key.count) * 100).toFixed(2).toLocaleString()}%` : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.key.disable && Number(value.key.disable) !== 0) ? Number(value.key.disable).toLocaleString() : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.key.count && Number(value.key.count) !== 0) ? `${(Number(value.key.disable / value.key.count) * 100).toFixed(2).toLocaleString()}%` : ''}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    New
                  </TableCell>
                  <TableCell align="right">
                    {(value.new.count && Number(value.new.count) !== 0) ? Number(value.new.count).toLocaleString() : ''}
                  </TableCell>
                  <TableCell align="right" />
                  <TableCell align="right">
                    {(value.new.win && Number(value.new.win) !== 0) ? Number(value.new.win).toLocaleString() : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.new.count && Number(value.new.count) !== 0) ? `${(Number(value.new.win / value.new.count) * 100).toFixed(2).toLocaleString()}%` : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.new.loss && Number(value.new.loss) !== 0) ? Number(value.new.loss).toLocaleString() : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.new.count && Number(value.new.count) !== 0) ? `${(Number(value.new.loss / value.new.count) * 100).toFixed(2).toLocaleString()}%` : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.new.pending && Number(value.new.pending) !== 0) ? Number(value.new.pending).toLocaleString() : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.new.count && Number(value.new.count) !== 0) ? `${(Number(value.new.pending / value.new.count) * 100).toFixed(2).toLocaleString()}%` : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.new.disable && Number(value.new.disable) !== 0) ? Number(value.new.disable).toLocaleString() : ''}
                  </TableCell>
                  <TableCell align="right">
                    {(value.new.count && Number(value.new.count) !== 0) ? `${(Number(value.new.disable / value.new.count) * 100).toFixed(2).toLocaleString()}%` : ''}
                  </TableCell>
                </TableRow>
              </TableBody>
            ))}
            <TableRow>
              <TableCell>
                <Typography
                  color="textPrimary"
                  variant="subtitle2"
                >
                  Grand Total
                </Typography>
              </TableCell>
              <TableCell align="right">
                {(total && Number(total) !== 0) ? Number(total).toLocaleString() : ''}
              </TableCell>
              <TableCell align="right">
                100%
              </TableCell>
              <TableCell align="right">
                {(win && Number(win) !== 0) ? Number(win).toLocaleString() : ''}
              </TableCell>
              <TableCell align="right">
                {(total && Number(total) !== 0) ? `${(Number(win / total) * 100).toFixed(2).toLocaleString()}%` : ''}
              </TableCell>
              <TableCell align="right">
                {(loss && Number(loss) !== 0) ? Number(loss).toLocaleString() : ''}
              </TableCell>
              <TableCell align="right">
                {(total && Number(total) !== 0) ? `${(Number(loss / total) * 100).toFixed(2).toLocaleString()}%` : ''}
              </TableCell>
              <TableCell align="right">
                {(pending && Number(pending) !== 0) ? Number(pending).toLocaleString() : ''}
              </TableCell>
              <TableCell align="right">
                {(total && Number(total) !== 0) ? `${(Number(pending / total) * 100).toFixed(2).toLocaleString()}%` : ''}
              </TableCell>
              <TableCell align="right">
                {(disable && Number(disable) !== 0) ? Number(disable).toLocaleString() : ''}
              </TableCell>
              <TableCell align="right">
                {(total && Number(total) !== 0) ? `${(Number(disable / total) * 100).toFixed(2).toLocaleString()}%` : ''}
              </TableCell>
            </TableRow>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
};

SalesPerformanceListTable.propTypes = {
  invoices: PropTypes.array.isRequired,
  total: PropTypes.array.isRequired,
  win: PropTypes.array.isRequired,
  loss: PropTypes.array.isRequired,
  pending: PropTypes.array.isRequired,
  disable: PropTypes.array.isRequired
};

export default SalesPerformanceListTable;
