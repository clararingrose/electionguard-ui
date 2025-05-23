/* eslint-disable react/require-default-props */
import { Box, SvgIconProps } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';

import { Message } from '../../lang';
import InternationalText from '../InternationalText';

const iconSize = 64;

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3),
        fontSize: iconSize,
        [theme.breakpoints.up('sm')]: {
            fontSize: iconSize * 2,
        },
    },
}));

export interface IconHeaderProps {
    title?: Message;
    titleId?: string;
    Icon?: React.ComponentType<SvgIconProps>;
}

/**
 * A menu option card for the menu screens
 */
export const IconHeader: React.FC<IconHeaderProps> = ({ Icon, title, titleId }) => {
    const classes = useStyles();
    if (!(title?.id || titleId)) throw new Error('title is required');
    return (
        <Box className={classes.root} display="flex" flexDirection="column" alignItems="center">
            {Icon && <Icon color="primary" fontSize="inherit" />}
            <InternationalText
                variant="h3"
                component="h1"
                id={title?.id || titleId}
                description="Heading of header for section"
            />
        </Box>
    );
};

export default IconHeader;
