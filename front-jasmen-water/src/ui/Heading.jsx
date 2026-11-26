function Heading({ children, className = "" }) {
  return (
    <h1
      className={`text-xl font-extrabold tracking-tight md:text-2xl ${className}`}
    >
      {children}
    </h1>
  );
}

export default Heading;
