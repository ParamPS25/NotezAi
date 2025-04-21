const MainLayout = ({ sidebar, children }) => {
    return (
      <div className="flex h-screen">
        {sidebar}
        <main className="flex-1 overflow-auto bg-white">{children}</main>
      </div>
    );
  };
  
  export default MainLayout;
  