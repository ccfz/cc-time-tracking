import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import useSession from './hooks/useSession';

const TaskSubmit = ({ history }) => {
  const { id: taskId } = useParams();
  const { stopSession, startSession } = useSession(taskId);
  const [task, setTask] = useState(null);
  const [errors, setErrors] = useState(null);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.addEventListener('focus', startSession);
    window.addEventListener('blur', stopSession);

    return () => {
      window.removeEventListener('focus', startSession);
      window.removeEventListener('blur', stopSession);
    }
  });

  useEffect(() => {
    (async () => {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`);
      const result = await response.json();
      setTask(result.data);
    })();
  }, [taskId]);

  const onChangeAnswer = useCallback(event =>
    setAnswer(event.target.value)
  , []);

  const onSubmitAnswer = useCallback(event => {
    (async () => {
      setIsSubmitting(true);
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: { submitted: true, answer } })
      });
      const result = await response.json();

      if (result.success) {
        setTask(result.data);
      } else {
        setErrors(JSON.stringify(result.errors));
      }

      setIsSubmitting(false);
    })();
  }, [taskId, answer]);

  const onNavigateBack = () => {
    if (!task.submitted) { stopSession() }
  }

  const isLoading = task === null;
  return isLoading
    ? 'Loading…'
    : (
      <>
        <div>
          <Link to="/" onClick={onNavigateBack}>Back</Link>
        </div>
        <div>
          <h1>{task.instructions}</h1>

          {
            task.submitted
              ? (
                <>
                  <h3>Your answer</h3>
                  <hr />
                  <p>{task.answer}</p>
                  <h2>{`Time to complete: ${task.total_time}/minutes`}</h2>
                </>
              ) : (
                <>
                  <p>Submit your answer:</p>
                  <textarea
                    rows="20"
                    style={{ display: 'block', width: '80%' }}
                    onChange={onChangeAnswer}
                    value={answer}
                  />
                  {errors ? <p>{errors}</p> : null}
                  <button onClick={onSubmitAnswer} disabled={isSubmitting}>
                    Submit
                  </button>
                </>
            )
          }
        </div>
      </>
    )
};

export default TaskSubmit;
