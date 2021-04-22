import { createMuiTheme } from '@material-ui/core/styles';

// https://material-ui.com/customization/palette/

const theme = createMuiTheme({
	palette: {
		type: 'dark',
	},
});

theme.typography.h1 = {
	fontSize: '5rem',
	'@media (max-width:575px)': {
		fontSize: '3rem',
	},
	'@media (max-width:300px)': {
		fontSize: '1.5rem',
	},
};

theme.typography.h3 = {
	fontSize: '3rem',
	'@media (max-width:575px)': {
		fontSize: '1.5rem',
	},
	'@media (max-width:300px)': {
		fontSize: '1.5rem',
	},
};

theme.typography.h4 = {
	fontSize: '3rem',
	'@media (max-width:800px)': {
		fontSize: '2rem',
	},
	'@media (max-width:575px)': {
		fontSize: '1.5rem',
	},
	'@media (max-width:375px)': {
		fontSize: '1rem',
	},
};

export default theme;
