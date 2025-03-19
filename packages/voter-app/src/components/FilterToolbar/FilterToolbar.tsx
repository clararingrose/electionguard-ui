import { GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid';
import * as React from 'react';

export const FilterToolbar: React.FC = () => (
    <GridToolbarContainer>
        <GridToolbarFilterButton onResize={undefined} onResizeCapture={undefined} />
    </GridToolbarContainer>
);

export default FilterToolbar;
