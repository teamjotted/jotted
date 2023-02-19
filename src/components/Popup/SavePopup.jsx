import React from 'react';
import { withStyles } from '@mui/styles';
import { Box, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const styles = () => ({
	root: {
		width: '100%',
		height: '100vh',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		alignContent: 'center',
		'& span': {
			textAlign: 'end',
			width: '100%',
			marginTop: '-10px',
			'& svg': {
				width: '20px',
				height: '30px',
				marginRight: '20px',
				color: '#00A4FF'
			}
		}
	},

	popupBox: {
		width: '100%',
		height: '100vh',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		alignContent: 'center'
	},
	mainBox: {
		'&.MuiBox-root': {
			width: '836px',
			height: '242px',
			maxWidth: '90%',
			borderRadius: '18px',
			display: 'flex',
			justifyContent: 'center',
			flexDirection: 'column',
			alignItems: 'center',
			background: '#FFFFFF',
			boxShadow: '0px 4px 26px rgba(75, 75, 75, 0.15)',
			textAlign: 'center',
			padding: '10px'
		}
	},
	popupPara: {
		'&.MuiBox-root': {
			'& h5': {
				fontWeight: ' 500',
				fontSize: ' 24px',
				lineHeight: ' 36px',
				color: '#171312',
				opacity: '0.5',
				margin: '0',
				letterSpacing: '0.2px'
			},
			'& p': {
				fontWeight: ' 300',
				fontSize: ' 20px',
				lineHeight: ' 30px',
				color: '#171312',
				opacity: '0.5',
				letterSpacing: '0.2px'
			}
		}
	},
	// popupBtn: {
	// 	'&.MuiBox-root': {
	// 		display: 'flex',
	// 		justifyContent: 'space-between',
	// 		alignItems: 'center'
	// 	}
	// },
	SaveBtn: {
		'&.MuiButton-root': {
			borderRadius: '8px',
			width: '196px',
			height: '64px',
			fontWeight: '600',
			fontSize: '24px',
			lineHeight: '36px',
			color: '#FFFFFF',
			background: '#E8CD94',
			marginRight: '20px'
		},
		'&:hover': {
			background: '#FFFFFF !important',
			color: '#E8CD94'
		}
	},
	CancelBtn: {
		'&.MuiButton-root': {
			borderRadius: '8px',
			width: '196px',
			height: '64px',
			fontWeight: '600',
			fontSize: '24px',
			lineHeight: '36px',
			color: '#E8CD94',
			background: '#FFFFFF'
		},
		'&:hover': {
			background: '#FFFFFF !important',
			color: '#E8CD94'
		}
	},
	//media query for 768px of screeen...

	'@media (max-width: 768px)': {
		BoxAvatar: {
			paddingLeft: '15px !important'
		}
	}
});

const SavePopup = (props) => {
	const { classes } = props;

	// jsx code
	return (
		<>
			<Box className={classes.root}>
				{/* <Box className={classes.popupBox}> */}
				<Box className={classes.mainBox}>
					<span>
						<CloseIcon />
					</span>
					<Box className={classes.popupPara}>
						<h5>One second!</h5>
						<p>Would you like to save your changes?</p>
					</Box>
					<Box className={classes.popupBtn}>
						<Button variant="contained" className={classes.SaveBtn}>
							Save
						</Button>
						<Button variant="contained" className={classes.CancelBtn}>
							Cancel
						</Button>
					</Box>
				</Box>
				{/* </Box> */}
			</Box>
		</>
	);
};

export default withStyles(styles)(SavePopup);
