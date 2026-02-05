const Section = ({ children, id }) => {
  return (
    <section
      id={id}
      className="grid place-items-center h-screen w-screen bg-section"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
};

export default Section;
