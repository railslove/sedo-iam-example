import Link from 'next/link';

import React from 'react';

const ValidAccess = ({ accessToken, blogEntries, error }) => {
  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <h2>Access Token: {accessToken}</h2>
        <p>{error.message}</p>
      </div>
    )
  }
  return (
    <div>
      <h1>Blog Entries</h1>
      <h2>Access Token: {accessToken}</h2>
      <ul>
        {blogEntries.map((blog, index) => (
          <li key={index}>
            <h2>{blog.title}</h2>
            <p>{blog.content}</p>
          </li>
        ))}
      </ul>

      <Link href="/">Back to home</Link>
    </div>
  );
};

export async function getServerSideProps(context) {
  console.log('fetching data from blogs-backend');
  console.log('context.req.headers', context.req.headers);
  const accessToken = context.req.headers['x-forwarded-access-token'] || 'unknown';
  try {
    // Replace with the actual URL of the external service
    const response = await fetch('http://blogs-backend:5001/api/blogs',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const blogEntries = await response.json();

    return {
      props: {
        accessToken,
        blogEntries,
      },
    };
  } catch (error) {
    console.error(error.message);
    return {
      props: {
        accessToken,
        error: { message: error.message },
      },
    };
  }
}

export default ValidAccess;
