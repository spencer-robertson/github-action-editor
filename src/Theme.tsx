interface ITheme {
	/** The font size */
	fontSize?: number;

	/** Primary colour used to identify the company; set to null to clear the current color */
	colorCompanyPrimary?: string | null;

	/** Color of the background of pages */
	colorBackground?: string;

	/** Color of the group of components */
	colorForeground?: string;
	colorForegroundSelected?: string;

	/** Colors for text */
	colorText?: string;
	colorTextLight?: string;

	/** Colors for invalid values and events' errors */
	colorInvalid?: string;
	colorInvalidLight?: string;

	/** Colors for valid values and events' successes */
	colorValid?: string;
	colorValidLight?: string;

	/** Colors for main actions and events' info */
	colorActive?: string;
	colorActiveLight?: string;

	/** Colors for events' warnings */
	colorWarning?: string;
	colorWarningLight?: string;

	/** Specifies if the shadows must be draw like borders, better for dark themes */
	hideShadows?: boolean;
}
export const LIGHT_THEME: ITheme = {
	colorBackground: "#f1f2f3",
	colorForeground: "#fff",
	colorForegroundSelected: "#fafafa",
	colorText: "#555",
	colorTextLight: "#555a",
	colorInvalid: "#d23",
	colorInvalidLight: "#d23a",
	colorValid: "#0b7",
	colorValidLight: "#0b7a",
	colorActive: "#27e",
	colorActiveLight: "#27ea",
	colorWarning: "#e90",
	colorWarningLight: "#e90a",
	hideShadows: false,
};

export const DARK_THEME: ITheme = {
	colorBackground: "#21252b",
	colorForeground: "#282c40",
	colorForegroundSelected: "#282c40",
	colorText: "#abb2bf",
	colorTextLight: "#abb2bfaa",
	colorInvalid: "#e06c75",
	colorInvalidLight: "#e06c75aa",
	colorValid: "#64DC96",
	colorValidLight: "#64DC96aa",
	colorActive: "#61afef",
	colorActiveLight: "#61afefaa",
	colorWarning: "#e5c07b",
	colorWarningLight: "#e5c07baa",
	hideShadows: true,
};

function setThemeValues(theme?: ITheme): void {
	const docStyle = document.documentElement.style;

	if (theme) {
		if (theme.fontSize) {
			switch (theme.fontSize) {
				case 14:
					docStyle.setProperty("--fontSize2XS", "10px");
					docStyle.setProperty("--fontSizeXS", "10px");
					docStyle.setProperty("--fontSizeS", "12px");
					docStyle.setProperty("--fontSizeM", "14px");
					docStyle.setProperty("--fontSizeL", "16px");
					docStyle.setProperty("--fontSizeXL", "18px");
					docStyle.setProperty("--fontSize2XL", "20px");
					docStyle.setProperty("--fontSize3XL", "24px");
					docStyle.setProperty("--fontSize4XL", "30px");
					docStyle.setProperty("--fontSize5XL", "36px");
					docStyle.setProperty("--fontSize6XL", "48px");
					docStyle.setProperty("--fontSize7XL", "60px");
					break;

				// 16 is default ;-)

				case 18:
					docStyle.setProperty("--fontSize2XS", "12px");
					docStyle.setProperty("--fontSizeXS", "14px");
					docStyle.setProperty("--fontSizeS", "16px");
					docStyle.setProperty("--fontSizeM", "18px");
					docStyle.setProperty("--fontSizeL", "20px");
					docStyle.setProperty("--fontSizeXL", "24px");
					docStyle.setProperty("--fontSize2XL", "30px");
					docStyle.setProperty("--fontSize3XL", "36px");
					docStyle.setProperty("--fontSize4XL", "48px");
					docStyle.setProperty("--fontSize5XL", "60px");
					docStyle.setProperty("--fontSize6XL", "72px");
					docStyle.setProperty("--fontSize7XL", "72px");
					break;

				case 20:
					docStyle.setProperty("--fontSize2XS", "14px");
					docStyle.setProperty("--fontSizeXS", "16px");
					docStyle.setProperty("--fontSizeS", "18px");
					docStyle.setProperty("--fontSizeM", "20px");
					docStyle.setProperty("--fontSizeL", "24px");
					docStyle.setProperty("--fontSizeXL", "30px");
					docStyle.setProperty("--fontSize2XL", "36px");
					docStyle.setProperty("--fontSize3XL", "48px");
					docStyle.setProperty("--fontSize4XL", "60px");
					docStyle.setProperty("--fontSize5XL", "72px");
					docStyle.setProperty("--fontSize6XL", "72px");
					docStyle.setProperty("--fontSize7XL", "72px");
					break;

				case 24:
					docStyle.setProperty("--fontSize2XS", "16px");
					docStyle.setProperty("--fontSizeXS", "18px");
					docStyle.setProperty("--fontSizeS", "20px");
					docStyle.setProperty("--fontSizeM", "24px");
					docStyle.setProperty("--fontSizeL", "30px");
					docStyle.setProperty("--fontSizeXL", "36px");
					docStyle.setProperty("--fontSize2XL", "48px");
					docStyle.setProperty("--fontSize3XL", "60px");
					docStyle.setProperty("--fontSize4XL", "72px");
					docStyle.setProperty("--fontSize5XL", "72px");
					docStyle.setProperty("--fontSize6XL", "72px");
					docStyle.setProperty("--fontSize7XL", "72px");
					break;

				default:
					docStyle.setProperty("--fontSize2XS", "10px");
					docStyle.setProperty("--fontSizeXS", "12px");
					docStyle.setProperty("--fontSizeS", "14px");
					docStyle.setProperty("--fontSizeM", "16px");
					docStyle.setProperty("--fontSizeL", "18px");
					docStyle.setProperty("--fontSizeXL", "20px");
					docStyle.setProperty("--fontSize2XL", "24px");
					docStyle.setProperty("--fontSize3XL", "30px");
					docStyle.setProperty("--fontSize4XL", "36px");
					docStyle.setProperty("--fontSize5XL", "48px");
					docStyle.setProperty("--fontSize6XL", "60px");
					docStyle.setProperty("--fontSize7XL", "72px");
					break;
			}
		}

		if (theme.colorCompanyPrimary) {
			docStyle.setProperty("--colorCompanyPrimary", theme.colorCompanyPrimary);

			try {
				const metaElement = document.querySelector<HTMLMetaElement>(
					"meta[name='theme-color']",
				);
				if (metaElement) {
					metaElement.content = theme.colorCompanyPrimary;
				}
			} catch (err) {
				console.error(err);
			}
		} else if (theme.colorCompanyPrimary === null) {
			docStyle.removeProperty("--colorCompanyPrimary");
		}

		if (theme.colorBackground) {
			docStyle.setProperty("--colorBackground", theme.colorBackground);
		}

		if (theme.colorForeground) {
			docStyle.setProperty("--colorForeground", theme.colorForeground);
		}

		if (theme.colorForegroundSelected) {
			docStyle.setProperty(
				"--colorForegroundSelected",
				theme.colorForegroundSelected,
			);
		}

		if (theme.colorText) {
			docStyle.setProperty("--colorText", theme.colorText);
		}

		if (theme.colorTextLight) {
			docStyle.setProperty("--colorTextLight", theme.colorTextLight);
		}

		if (theme.colorInvalid) {
			docStyle.setProperty("--colorInvalid", theme.colorInvalid);
		}

		if (theme.colorInvalidLight) {
			docStyle.setProperty("--colorInvalidLight", theme.colorInvalidLight);
		}

		if (theme.colorValid) {
			docStyle.setProperty("--colorValid", theme.colorValid);
		}

		if (theme.colorValidLight) {
			docStyle.setProperty("--colorValidLight", theme.colorValidLight);
		}

		if (theme.colorActive) {
			docStyle.setProperty("--colorActive", theme.colorActive);
		}

		if (theme.colorActiveLight) {
			docStyle.setProperty("--colorActiveLight", theme.colorActiveLight);
		}

		if (theme.colorWarning) {
			docStyle.setProperty("--colorWarning", theme.colorWarning);
		}

		if (theme.colorWarningLight) {
			docStyle.setProperty("--colorWarningLight", theme.colorWarningLight);
		}
	}
}

export const setTheme = (
	nightMode: boolean | undefined,
	fontSize: number | undefined,
) => {
	const theme = nightMode ? DARK_THEME : LIGHT_THEME;

	setThemeValues({ fontSize, ...theme });
};
