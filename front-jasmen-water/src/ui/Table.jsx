const Table = ({ children }) => {
  return (
    <div className="surface-card overflow-x-auto">
      <table className="w-full text-start text-sm">{children}</table>
    </div>
  );
};

const Header = ({ children }) => {
  return (
    <thead className="bg-primary text-xs uppercase text-mutedText">
      <tr>{children}</tr>
    </thead>
  );
};

const Body = ({ data, render }) => {
  return <tbody>{data?.map(render)}</tbody>;
};

const Row = ({ children }) => {
  return (
    <tr className="border-b border-line transition-colors last:border-b-0 hover:bg-primary">
      {children}
    </tr>
  );
};

const Cell = ({ children, isHeader = false }) => {
  const Tag = isHeader ? "th" : "td";
  return (
    <Tag
      scope={isHeader ? "col" : undefined}
      className="px-6 py-4 text-start font-semibold first:ps-6"
    >
      {children}
    </Tag>
  );
};

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Cell = Cell;

export default Table;
