import React from 'react';

export default function StatusAlert({status}){
    return(
        status ? ( status.error ? (
            <div role="alert" className="alert alert-danger">
              <div className="alert-text">{status.message}</div>
            </div>
          ) : (
            <div role="alert" className="alert alert-info">
              <div className="alert-text">
                {status.message}
              </div>
            </div>
          )
        ): null
    )
          
}