import ScoreBadge from "./ScoreBadge";
import ScoreGauge from "./ScoreGauge"

const Category = ({name, score}: {name: string, score: number}) => {

  const textColor = score > 70 ? "text-green-600" : score > 30 ? "text-yellow-600" : "text-red-600";
  return (
    <div className="resume-summary">
      <div className="category">
        <div className="flex flex-row items-center justify-center gap-2">
          <p className="text-xl">{name}</p>
          <ScoreBadge score={score} />
        </div>
        <p className="text-sm">
          <span className= {`${textColor} font-semibold text-lg`}>{score}</span>/100</p>
      </div>
    </div>
  )
}

const Summary = ({feedback}: {feedback: Feedback}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md w-full">
      <div className="flex flex-row gap-8 items-center p-4">
        <ScoreGauge score={feedback.overallScore} />
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold">Your Resume Score</h2>
          <p className="text-sm text-gray-500">This score is calculated based on the variables listed below.</p>
        </div>
      </div>
      <Category name = "Tone & Style" score =  {feedback.toneAndStyle.score} />
      <Category name = "Content" score =  {feedback.content.score} />
      <Category name = "Structure" score =  {feedback.structure.score} />
      <Category name = "Skills" score =  {feedback.skills.score} />
    </div>
  )
}

export default Summary