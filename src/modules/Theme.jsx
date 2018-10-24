import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import indigo from '@material-ui/core/colors/indigo';

const Theme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: blue,
    type: 'dark',
  },
  typography: {
    useNextVariants: true,
  },
});

export default Theme;

