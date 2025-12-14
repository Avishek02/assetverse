import React from "react";
import { Link } from "react-router-dom";


function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-base-200 text-base-content border-t">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <Link to="/" className="text-xl font-bold tracking-tight">
              AssetVerse
            </Link>
            <p className="text-sm opacity-80">
              Corporate Asset &amp; HR Management platform for teams.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link className="link link-hover" to="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="link link-hover" to="/join/employee">
                  Join as Employee
                </Link>
              </li>
              <li>
                <Link className="link link-hover" to="/join/hr">
                  Join as HR Manager
                </Link>
              </li>
              <li>
                <Link className="link link-hover" to="/login">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link className="link link-hover" to="/faq">
                  FAQ
                </Link>
              </li>
              <li>
                <Link className="link link-hover" to="/contact">
                  Contact
                </Link>
              </li>
              <li>
                <Link className="link link-hover" to="/privacy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link className="link link-hover" to="/terms">
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="font-medium">Email:</span>{" "}
                <a className="link link-hover" href="mailto:support@assetverse.com">
                  support@assetverse.com
                </a>
              </li>
              <li>
                <span className="font-medium">Phone:</span>{" "}
                <a className="link link-hover" href="tel:+8801000000000">
                  +880 10-0000-0000
                </a>
              </li>
              <li className="opacity-80">Dhaka, Bangladesh</li>
            </ul>

            <div className="mt-4 flex items-center gap-3">
              <a
                className="btn btn-ghost btn-sm btn-circle"
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                  <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 23.5h4V7.98h-4V23.5zM8 7.98h3.83v2.12h.05c.53-1 1.84-2.12 3.78-2.12 4.04 0 4.79 2.66 4.79 6.12v9.4h-4v-8.34c0-1.99-.04-4.55-2.77-4.55-2.77 0-3.19 2.16-3.19 4.4v8.49H8V7.98z" />
                </svg>
              </a>

              <a
                className="btn btn-ghost btn-sm btn-circle"
                href="https://www.facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                title="Facebook"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                  <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
                </svg>
              </a>

              <a
                className="btn btn-ghost btn-sm btn-circle"
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                title="X"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                  <path d="M18.9 2H22l-6.78 7.74L23.5 22h-6.5l-5.1-6.6L5.9 22H2l7.33-8.38L1 2h6.66l4.62 5.98L18.9 2zm-1.14 18h1.7L6.73 3.9H4.9L17.76 20z" />
                </svg>
              </a>

              <a
                className="btn btn-ghost btn-sm btn-circle"
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                title="GitHub"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                  <path d="M12 .5C5.73.5.75 5.62.75 12c0 5.1 3.29 9.42 7.86 10.95.58.11.79-.26.79-.57v-2.1c-3.2.71-3.87-1.58-3.87-1.58-.53-1.37-1.29-1.73-1.29-1.73-1.05-.73.08-.71.08-.71 1.16.08 1.77 1.23 1.77 1.23 1.03 1.81 2.7 1.29 3.36.99.1-.77.4-1.29.73-1.59-2.55-.3-5.23-1.31-5.23-5.82 0-1.29.45-2.34 1.18-3.17-.12-.3-.52-1.52.11-3.16 0 0 .97-.32 3.18 1.21.92-.26 1.9-.39 2.88-.39.98 0 1.96.13 2.88.39 2.2-1.53 3.18-1.21 3.18-1.21.63 1.64.23 2.86.11 3.16.74.83 1.18 1.88 1.18 3.17 0 4.52-2.69 5.52-5.25 5.81.41.37.78 1.1.78 2.22v3.29c0 .31.21.68.8.57A11.28 11.28 0 0 0 23.25 12C23.25 5.62 18.27.5 12 .5z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="divider my-8" />

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-sm">
          <p>© {year} AssetVerse. All rights reserved.</p>
          <div className="flex gap-4">
            <Link className="link link-hover" to="/privacy">
              Privacy
            </Link>
            <Link className="link link-hover" to="/terms">
              Terms
            </Link>
            <Link className="link link-hover" to="/contact">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

