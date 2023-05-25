import axios from 'axios';
import Cookies from 'js-cookie';

const DownloadAnswers = (props) => {
  const token = Cookies.get('token');

  const headers = {
    Authorization: token
  };

  const handleDownload = () => {
    if (!token) {
      alert('Please log in to download answers.');
      return;
    }

    axios.get('http://localhost:8000/export-answers', {
      headers,
      responseType: 'blob',
      params: {
        questionnaireId: props.questionnaireId
      }
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'answers.csv');
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        if (error.response && error.response.status === 404 && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          console.error(error);
        }
      });
  };

  return (
    <div>
      <button onClick={handleDownload}>Download Answers</button>
    </div>
  );
};

export default DownloadAnswers;
