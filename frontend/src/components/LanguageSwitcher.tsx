'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '../i18n/routing';
import { 
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
  ListItemIcon
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState, MouseEvent } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh-CN', name: '中文' }
  ];

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];
  
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
    handleClose();
  };
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Button
        color="inherit"
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        startIcon={<LanguageIcon />}
        size="small"
      >
        <Typography variant="body2">
          {currentLanguage.name}
        </Typography>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
      >
        {languages.map((lang) => (
          <MenuItem 
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={lang.code === locale}
          >
            {lang.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
} 