import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Report = () => {
  const [taskReport, setTaskReport] = React.useState(null);

  useEffect(() => {
    (async () => {
      const response = await fetch('http://localhost:5000/tasks_report');
      const result = await response.json();

      setTaskReport(result.data);
    })();
  }, []);

  if (!taskReport) { return <div>Loading...</div> }

  return (
    <>
      <div>
        <Link to="/" >Back</Link>
      </div>
      <h1>Report Page</h1>
      <h2>All times in minutes</h2>
      <h3>{`Total time spend: ${taskReport.total_time}`}</h3>
      <h3>{`Avg. time per task: ${taskReport.avg_per_task}`}</h3>
      <h3>{`Avg. time per session: ${taskReport.avg_per_session}`}</h3>
    </>
  )
}

export default Report;
