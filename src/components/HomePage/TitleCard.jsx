// import { Card, CardContent, Typography } from '@mui/material';
import { Typography, Paper } from '@mui/material';
const TitleCard = ({ title }) => {
	return (
		// <Card sx={{ width: 300, backgroundColor: '#787878', color: 'white', textAlign: 'center' }}>
		//   <CardContent>
		//     <Typography variant="h4" fontWeight="bold">{title}</Typography>
		//   </CardContent>
		// </Card>

		<Paper
			elevation={5}
			sx={{
				width: 300,
				height: 200,
				backgroundColor: '#787878',
				borderRadius: 4,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				padding: 2,
			}}
		>
			<Typography variant='h2' fontWeight='bold' mb={1} color='white' align='center'>
				{title}
			</Typography>
		</Paper>
	);
};

export default TitleCard;
