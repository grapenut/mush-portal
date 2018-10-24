import { createMuiTheme } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
import indigo from '@material-ui/core/colors/indigo';

const Theme = createMuiTheme({
  typography: {
    useNextVariants: true,
//    suppressDeprecationWarnings: true,
  },
  palette: {
    primary: indigo,
    secondary: blueGrey,
    type: 'dark',
  },
});

export default Theme;

