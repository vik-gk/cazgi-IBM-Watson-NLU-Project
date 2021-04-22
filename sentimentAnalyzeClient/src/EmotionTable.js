import React from 'react';
import './bootstrap.min.css';

class EmotionTable extends React.Component {
    
    render() {

			const emotionsList = this.props.emotions.result
			
      return (  
        <div>
          <table className="table table-bordered">
            <tbody>
            {
                emotionsList.map((emotion) =>
										<tr>
											<td>{emotion.emotion}</td>
											<td>{emotion.score}</td>
										</tr>		
								)
            }
            </tbody>
          </table>
          </div>
          );
        }
    
}
export default EmotionTable;