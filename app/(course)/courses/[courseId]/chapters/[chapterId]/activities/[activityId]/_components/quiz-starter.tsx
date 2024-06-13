import { Button } from "@/components/ui/button";

type QuizStarterProps =  {
  questionCount: number;
  onStarted: () => void;
  score?: number;
}

export const QuizStarter = ({
  questionCount,
  score,
  onStarted
}: QuizStarterProps) => {
  return (
    <div className="w-100 h-100">
      <div className="text-lg w-100 text-center p-10">
        <p>{questionCount} question{questionCount===1 ? '':'s'}</p>
        <p>No timer</p>
        {score !== undefined && <p className="font-bold">Last attempt's score: {score}/{questionCount}</p>}
      </div>
      <div className="w-100 text-center">
        <Button onClick={onStarted}>{typeof score === 'undefined' ? 'Get started' : 'Restart'} </Button>
      </div>
      {score !== undefined && (
        <div className="w-100 text-center p-4">
          <Button variant={'success'}>View answers</Button>
        </div>
      
      )}
    </div>
  )
}