import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button, Menu, MenuItem, Typography } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useLocale } from 'next-intl';
import { localeNames, locales } from '../i18n';
import Link from 'next/link';

const LanguageSwitcher: React.FC = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  return (
    <>
      <Button
        color="inherit"
        startIcon={<LanguageIcon />}
        onClick={handleClick}
        aria-controls={open ? 'language-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        {localeNames[locale as keyof typeof localeNames] || 'Language'}
      </Button>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
      >
        {locales.map((lang) => (
          <MenuItem 
            key={lang} 
            component={Link}
            href={pathname}
            locale={lang}
            onClick={handleClose}
            selected={locale === lang}
          >
            <Typography variant="body1">
              {localeNames[lang as keyof typeof localeNames]}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSwitcher; 