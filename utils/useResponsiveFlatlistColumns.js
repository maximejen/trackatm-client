import React from 'react';

const useResponsiveFlatlistColumns = ({
  itemMaxWidth = 20,
  gap = 20,
  maxColumns = null,
}) => {
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [nbColumns, setNbColumns] = React.useState(0);
  const [itemWidth, setItemWidth] = React.useState(2);

  React.useMemo(() => {
    if (containerWidth === 0) return;
    if (itemMaxWidth > containerWidth) return;
    let nbCols = Math.floor(containerWidth / (itemMaxWidth + gap));
    if (maxColumns) {
      nbCols = Math.min(nbCols, maxColumns);
    }
    const itemNewWidth = containerWidth / nbCols - gap;
    setItemWidth(itemNewWidth);
    setNbColumns(Math.floor(nbCols));
  }, [containerWidth, itemMaxWidth, gap, maxColumns]);

  return React.useMemo(
    () => ({
      setContainerWidth,
      nbColumns,
      itemWidth,
      containerWidth,
    }),
    [setContainerWidth, nbColumns, itemWidth, containerWidth],
  );
};

export default useResponsiveFlatlistColumns;
