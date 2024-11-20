import React from 'react';

const DocusignEmbed = (recipientViewUrl) => {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
        <iframe
          src={recipientViewUrl}
          title="DocuSign Recipient View"
          width="100%"
          height="100%"
          allowFullScreen
        />
    </div>
  );
};

export default DocusignEmbed;
