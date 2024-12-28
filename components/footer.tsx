const Footer = () => {
  return (
    <footer className="flex flex-row items-center justify-between absolute bottom-[8vh] left-[50vw] translate-x-[-50%] h-16 bg-red-500 w-[25vw] rounded-full nav p-4">
      <div className="text-center text-sm text-white">
        Made with ♥ by{" "}
        <a
          href="https://github.com/MrlolDev"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white/50 underline transition-all duration-300"
        >
          Leo
        </a>
      </div>
      <a
        href="https://github.com/MrlolDev/christmas-maze"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-white/50 underline transition-all duration-300"
      >
        Source Code
      </a>
    </footer>
  );
};

export default Footer;
