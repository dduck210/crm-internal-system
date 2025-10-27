const Icon = ({ name, className = "" }) => {
  switch (name) {
    case "profile":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
        >
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
      );
    case "settings":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
        >
          <path d="M19.4 12.9c.1-.3.1-.6.1-.9s0-.6-.1-.9l2.1-1.6c.2-.2.3-.5.2-.7l-2-3.5c-.1-.2-.4-.3-.7-.2l-2.5 1c-.5-.4-1.1-.7-1.7-.9l-.4-2.7c0-.3-.3-.5-.6-.5h-4c-.3 0-.6.2-.6.5l-.4 2.7c-.6.2-1.2.5-1.7.9l-2.5-1c-.3-.1-.6 0-.7.2l-2 3.5c-.1.2 0 .5.2.7l2.1 1.6c-.1.3-.1.6-.1.9s0 .6.1.9l-2.1 1.6c-.2.2-.3.5-.2.7l2 3.5c.1.2.4.3.7.2l2.5-1c.5.4 1.1.7 1.7.9l.4 2.7c0 .3.3.5.6.5h4c.3 0 .6-.2.6-.5l.4-2.7c.6-.2 1.2-.5 1.7-.9l2.5 1c.3.1.6 0 .7-.2l2-3.5c.1-.2 0-.5-.2-.7l-2.1-1.6zM12 15.6c-2 0-3.6-1.6-3.6-3.6S10 8.4 12 8.4s3.6 1.6 3.6 3.6-1.6 3.6-3.6 3.6z" />
        </svg>
      );
    case "sun":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
        >
          <path d="M6.76 4.84l-1.8-1.79-1.42 1.41 1.79 1.8 1.43-1.42zm10.45 10.45l1.79 1.8 1.42-1.42-1.8-1.79-1.41 1.41zM12 4V1h-1v3h1zm0 19v-3h-1v3h1zm8-8h3v-1h-3v1zM1 12h3v-1H1v1zm16.24-7.16l1.79-1.8-1.42-1.41-1.8 1.79 1.43 1.42zm-10.48 10.5l-1.79 1.79 1.42 1.41 1.8-1.79-1.43-1.41zM12 7a5 5 0 100 10 5 5 0 000-10z" />
        </svg>
      );
    case "moon":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
        >
          <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
        </svg>
      );
    case "logout":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
        >
          <path d="M16 13v-2H7V8l-5 4 5 4v-3h9zm3-10H5c-1.1 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
        </svg>
      );
    default:
      return null;
  }
};

export default Icon;
