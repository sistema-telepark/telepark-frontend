import React from 'react';
import PropTypes from 'prop-types';

export const MenuIcon = ({ size = 16, color = 'currentColor', className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill={color}
    className={className}
    viewBox="0 0 16 16"
    aria-hidden="true"
    {...rest}
  >
    <path
      fillRule="evenodd"
      d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
    />
  </svg>
);

// ...rest propaga props nativas de SVG y no se declara en propTypes.
MenuIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
};

export const HomeIcon = ({ size = 16, color = 'currentColor', className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill={color}
    className={className}
    viewBox="0 0 16 16"
    aria-hidden="true"
    {...rest}
  >
    <path
      fillRule="evenodd"
      d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"
    />
    <path
      fillRule="evenodd"
      d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"
    />
  </svg>
);

HomeIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
};

export const AdminUsersIcon = ({ size = 16, color = 'currentColor', className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill={color}
    className={className}
    viewBox="0 0 880 980"
    aria-hidden="true"
    {...rest}
  >
    <g transform="translate(0.000000,980.000000) scale(0.1,-0.098)" stroke="none">
      <path d="M3151 9789 c-718 -75 -1367 -524 -1691 -1169 -413 -821 -253 -1820 394 -2465 157 -156 340 -292 519 -385 l87 -45 -2 -149 -3 -148 -190 -48 c-284 -72 -475 -142 -692 -255 -369 -192 -665 -449 -900 -781 -327 -462 -526 -1052 -612 -1814 -36 -318 -45 -514 -46 -965 l0 -440 28 -58 c223 -454 1437 -749 3487 -847 118 -6 411 -13 650 -15 377 -5 430 -3 400 9 -125 49 -227 125 -293 219 -83 117 -550 940 -574 1010 -50 149 -37 319 35 467 48 98 157 209 264 269 l76 43 0 207 0 206 -85 50 c-111 64 -209 167 -256 267 -51 106 -61 150 -61 273 0 164 12 190 314 716 144 250 272 468 285 484 134 179 358 274 572 244 92 -13 174 -42 267 -97 l69 -40 67 44 c37 23 114 68 173 99 l106 56 3 81 3 81 -135 90 c-145 96 -415 233 -573 292 -120 44 -308 98 -442 128 l-100 22 -3 150 -2 150 77 40 c308 161 593 418 794 717 170 253 288 557 335 869 24 157 24 453 0 609 -109 714 -542 1307 -1181 1620 -359 176 -771 250 -1164 209z" />
      <path d="M5967 4853 c-4 -3 -7 -129 -7 -279 l0 -273 -57 -16 c-283 -79 -585 -251 -794 -452 l-46 -44 -234 135 c-128 75 -236 136 -239 136 -11 -1 -481 -830 -476 -839 4 -5 110 -69 237 -142 220 -126 231 -133 225 -158 -52 -234 -58 -274 -63 -436 -6 -189 3 -288 44 -458 14 -60 21 -112 17 -117 -5 -5 -110 -67 -234 -138 -124 -72 -225 -137 -225 -144 0 -17 467 -828 477 -828 4 0 112 60 240 134 l233 134 65 -62 c196 -184 472 -343 734 -422 l96 -28 0 -278 0 -278 488 2 487 3 3 275 2 275 82 25 c270 81 552 241 748 427 l66 61 229 -133 c127 -74 235 -134 240 -134 13 -1 489 828 481 837 -4 3 -109 66 -234 138 -259 150 -237 121 -204 279 58 275 57 479 -4 763 -16 72 -23 127 -18 131 5 5 106 64 224 132 118 67 221 128 228 134 11 10 -33 91 -223 421 -130 225 -240 413 -244 417 -4 4 -113 -53 -241 -127 l-233 -135 -80 71 c-216 190 -413 305 -687 398 l-135 46 -3 277 -2 277 -478 0 c-263 0 -482 -3 -485 -7z m754 -1286 c353 -91 625 -309 778 -621 255 -521 95 -1143 -380 -1479 -94 -66 -256 -141 -374 -173 -134 -35 -354 -44 -494 -20 -427 75 -782 381 -916 791 -93 286 -68 622 68 890 86 172 260 364 419 463 136 84 304 146 465 172 104 16 326 5 434 -23z" />
    </g>
  </svg>
);

AdminUsersIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
};

export const AddPersonIcon = ({ size = 16, color = 'currentColor', className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill={color}
    className={className}
    viewBox="0 0 16 16"
    aria-hidden="true"
    {...rest}
  >
    <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    <path
      fillRule="evenodd"
      d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"
    />
  </svg>
);

AddPersonIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
};

export const FamilyIcon = ({ size = 16, color = 'currentColor', className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill={color}
    className={className}
    viewBox="0 0 16 16"
    aria-hidden="true"
    {...rest}
  >
    <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    <path
      fillRule="evenodd"
      d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"
    />
    <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
  </svg>
);

FamilyIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
};

export const MedicalRecordIcon = ({ size = 16, color = 'currentColor', className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill={color}
    className={className}
    viewBox="0 0 16 16"
    aria-hidden="true"
    {...rest}
  >
    <path
      fillRule="evenodd"
      d="M8 4a.5.5 0 0 1 .5.5v.634l.549-.317a.5.5 0 1 1 .5.866L9 6l.549.317a.5.5 0 1 1-.5.866L8.5 6.866V7.5a.5.5 0 0 1-1 0v-.634l-.549.317a.5.5 0 1 1-.5-.866L7 6l-.549-.317a.5.5 0 0 1 .5-.866l.549.317V4.5A.5.5 0 0 1 8 4zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"
    />
    <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z" />
    <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z" />
  </svg>
);

MedicalRecordIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
};

export const SearchSidebarIcon = ({
  size = 16,
  color = 'currentColor',
  className,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill={color}
    className={className}
    viewBox="0 0 16 16"
    aria-hidden="true"
    {...rest}
  >
    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
  </svg>
);

SearchSidebarIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
};

export const NomencladorIcon = ({ size = 16, color = 'currentColor', className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill={color}
    className={className}
    viewBox="0 0 16 16"
    aria-hidden="true"
    {...rest}
  >
    <path
      fillRule="evenodd"
      d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3.854 2.146a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 3.293l1.146-1.147a.5.5 0 0 1 .708 0zm0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 7.293l1.146-1.147a.5.5 0 0 1 .708 0zm0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0z"
    />
  </svg>
);

NomencladorIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
};

export const CalendarIcon = ({ size = 16, color = 'currentColor', className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill={color}
    className={className}
    viewBox="0 0 16 16"
    aria-hidden="true"
    {...rest}
  >
    <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
  </svg>
);

CalendarIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
};

export const TableIcon = ({ size = 16, color = 'currentColor', className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill={color}
    className={className}
    viewBox="0 0 16 16"
    aria-hidden="true"
    {...rest}
  >
    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z" />
  </svg>
);

TableIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
};

export const LogoutIcon = ({ size = 16, color = 'currentColor', className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill={color}
    className={className}
    viewBox="0 0 512.00533 512"
    aria-hidden="true"
    {...rest}
  >
    <path d="m320 277.335938c-11.796875 0-21.332031 9.558593-21.332031 21.332031v85.335937c0 11.753906-9.558594 21.332032-21.335938 21.332032h-64v-320c0-18.21875-11.605469-34.496094-29.054687-40.554688l-6.316406-2.113281h99.371093c11.777344 0 21.335938 9.578125 21.335938 21.335937v64c0 11.773438 9.535156 21.332032 21.332031 21.332032s21.332031-9.558594 21.332031-21.332032v-64c0-35.285156-28.714843-63.99999975-64-63.99999975h-229.332031c-.8125 0-1.492188.36328175-2.28125.46874975-1.027344-.085937-2.007812-.46874975-3.050781-.46874975-23.53125 0-42.667969 19.13281275-42.667969 42.66406275v384c0 18.21875 11.605469 34.496093 29.054688 40.554687l128.386718 42.796875c4.351563 1.34375 8.679688 1.984375 13.226563 1.984375 23.53125 0 42.664062-19.136718 42.664062-42.667968v-21.332032h64c35.285157 0 64-28.714844 64-64v-85.335937c0-11.773438-9.535156-21.332031-21.332031-21.332031zm0 0" />
    <path d="m505.75 198.253906-85.335938-85.332031c-6.097656-6.101563-15.273437-7.9375-23.25-4.632813-7.957031 3.308594-13.164062 11.09375-13.164062 19.714844v64h-85.332031c-11.777344 0-21.335938 9.554688-21.335938 21.332032 0 11.777343 9.558594 21.332031 21.335938 21.332031h85.332031v64c0 8.621093 5.207031 16.40625 13.164062 19.714843 7.976563 3.304688 17.152344 1.46875 23.25-4.628906l85.335938-85.335937c8.339844-8.339844 8.339844-21.824219 0-30.164063zm0 0" />
  </svg>
);

LogoutIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
};
