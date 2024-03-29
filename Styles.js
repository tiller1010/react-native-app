import { StyleSheet } from 'react-native';

const Styles = StyleSheet.create({
	container: {
	    flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: '20 30px',
		backgroundColor: '#555',
		color: '#fff'
	},
	buttonStyles: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'skyblue',
		color: 'white',
		height: 150,
		width: 150
	},
	pad: {
		padding: 20
	},
	halfPad: {
		padding: 10
	},
	noXPad: {
		paddingLeft: 0,
		paddingRight: 0
	},
	noYPad: {
		paddingTop: 0,
		paddingBottom: 0
	},
	flex: {
		flex: 1,
		flexDirection: 'row'
	},
	column: {
		flexDirection: 'column'
	},
	xCenter: {
		justifyContent: 'center'
	},
	xEnd: {
		justifyContent: 'flex-end'
	},
	xSpaceBetween: {
		justifyContent: 'space-between'
	},
	xSpaceAround: {
		justifyContent: 'space-around'
	},
	yCenter: {
		alignItems: 'center'
	},
	fullWidth: {
		width: '100%'
	},
	heading: {
		fontSize: 30,
		fontWeight: 'bold'
	},
	subHeading: {
		fontSize: 20,
		fontWeight: 'bold'
	},
	textWhite: {
		color: '#fff',
	},
	homeBannerContent: {
		backgroundColor: '#9f74e4',
	},
	homeBannerLink: {
		backgroundColor: '#747de8',
		borderRadius: '15px',
	}
});

export default Styles;