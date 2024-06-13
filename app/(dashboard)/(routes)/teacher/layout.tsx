import { auth } from "@clerk/nextjs";

const TeacherLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>
}
 
export default TeacherLayout;