import { Navbar } from "./_components/navbar";

const WelcomeLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return ( 
    <div className="h-full">
      <div className="h-[80px] fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <main className="pt-[80px] h-full">
        {children}
      </main>
    </div>
   );
}
 
export default WelcomeLayout;