

const tailwindAtRules = [
  "theme",
  "source",
  "utility",
  "variant",
  "custom-variant",
  "apply",
  "reference"
];

/** @type {import("stylelint").Config} */
const styleLintConfig={
  extends: [
    "stylelint-config-standard-scss",
    "stylelint-config-css-modules",
  ],
  rules: {
    "color-hex-length": null,
  }
}

export default styleLintConfig;
