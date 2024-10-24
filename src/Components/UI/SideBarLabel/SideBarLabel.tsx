import { Badge, BadgeProps, ListItemText, styled } from "@mui/material";

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
	"& .MuiBadge-badge": {
		right: -5,
		top: 4,
	},
}));

export const SideBarLabel = ({
	primary,
	hasValue,
}: {
	primary: string;
	hasValue: boolean;
}) => {
	return (
		<ListItemText
			primary={
				<StyledBadge color="primary" variant="dot" invisible={!hasValue}>
					{primary}
				</StyledBadge>
			}
		/>
	);
};
