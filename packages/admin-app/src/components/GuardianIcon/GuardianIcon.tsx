import { Box, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Brightness1 as CircleIcon } from '@mui/icons-material';
import React from 'react';
import { useIntl } from 'react-intl';

import { MessageId } from '../../lang';

const iconSize = 36;

const useStyles = (color?: string) => {
    const styles = makeStyles((theme) => ({
        iconContainer: {
            zIndex: 1,
            gridArea: 'area-1',
            color: color || theme.palette.primary.main,
        },
        text: {
            zIndex: 2,
            gridArea: 'area-1',
            fontWeight: 'bold',
            color: theme.palette.getContrastText(color || theme.palette.primary.main),
        },
    }));
    return styles();
};

export interface GuardianIconProps {
    // eslint-disable-next-line react/require-default-props
    color?: string;
    sequenceOrder: number;
}

/**
 * A menu option card for the menu screens
 */
export const GuardianIcon: React.FC<GuardianIconProps> = ({ color, sequenceOrder }) => {
    const classes = useStyles(color);
    const intl = useIntl();
    return (
        <Box display="grid" alignItems="center" justifyItems="center">
            <Box
                className={classes.iconContainer}
                display="flex"
                justifyContent="center"
                alignItems="center"
                height={iconSize}
                gridArea="area1"
                zIndex={1}
                fontSize={iconSize}
            >
                <CircleIcon fontSize="inherit" color="inherit" />
            </Box>
            <Typography
                className={classes.text}
                aria-label={intl.formatMessage({ id: MessageId.Guardian })}
            >
                {sequenceOrder}
            </Typography>
        </Box>
    );
};

export default GuardianIcon;
