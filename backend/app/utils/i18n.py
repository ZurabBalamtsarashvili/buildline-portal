from typing import Dict, Optional
import json
import os
from pathlib import Path
from fastapi import Request
from ..config import Config

class I18nManager:
    """
    Internationalization manager for handling translations
    """
    def __init__(self):
        self.translations: Dict[str, Dict] = {}
        self.default_language = Config.DEFAULT_LANGUAGE
        self._load_translations()

    def _load_translations(self):
        """
        Load all translation files from the i18n directory
        """
        i18n_dir = Path(__file__).parent.parent.parent.parent / 'frontend/src/i18n'
        
        for lang in Config.SUPPORTED_LANGUAGES:
            try:
                with open(i18n_dir / f'{lang}.json', 'r', encoding='utf-8') as f:
                    self.translations[lang] = json.load(f)
            except FileNotFoundError:
                print(f"Warning: Translation file for {lang} not found")
            except json.JSONDecodeError:
                print(f"Warning: Invalid JSON in translation file for {lang}")

    def get_text(
        self,
        key: str,
        language: str = None,
        default: str = None,
        **kwargs
    ) -> str:
        """
        Get translated text for a given key
        """
        # Use default language if none specified
        language = language or self.default_language

        # Fall back to default language if requested language not available
        if language not in self.translations:
            language = self.default_language

        # Get translation
        translation = self.translations.get(language, {})
        for part in key.split('.'):
            translation = translation.get(part, {})

        if not translation or isinstance(translation, dict):
            # Key not found or points to a nested object
            return default or key

        # Format string with provided kwargs
        try:
            return translation.format(**kwargs)
        except KeyError:
            # Return unformatted string if formatting fails
            return translation

    def get_language(self, request: Request) -> str:
        """
        Determine language from request
        Priority: query param > header > cookie > default
        """
        # Check query parameter
        lang = request.query_params.get('lang')
        if lang in Config.SUPPORTED_LANGUAGES:
            return lang

        # Check Accept-Language header
        accept_language = request.headers.get('Accept-Language', '')
        for lang_code in accept_language.split(','):
            lang = lang_code.strip().split('-')[0]  # Get primary language tag
            if lang in Config.SUPPORTED_LANGUAGES:
                return lang

        # Check cookie
        lang = request.cookies.get('language')
        if lang in Config.SUPPORTED_LANGUAGES:
            return lang

        # Fall back to default
        return self.default_language

# Create singleton instance
i18n = I18nManager()

# Utility functions
def translate(
    key: str,
    language: Optional[str] = None,
    default: Optional[str] = None,
    **kwargs
) -> str:
    """
    Translate a key to the specified language
    """
    return i18n.get_text(key, language, default, **kwargs)

def get_all_translations(language: str) -> Dict:
    """
    Get all translations for a language
    """
    return i18n.translations.get(language, {})

# Translation key constants
# These help catch typos and make refactoring easier
class TranslationKeys:
    # Common
    LOADING = "common.loading"
    ERROR = "common.error"
    SUCCESS = "common.success"
    SAVE = "common.save"
    CANCEL = "common.cancel"
    DELETE = "common.delete"
    EDIT = "common.edit"
    CREATE = "common.create"
    SEARCH = "common.search"
    
    # Auth
    LOGIN = "auth.login"
    LOGOUT = "auth.logout"
    REGISTER = "auth.register"
    PASSWORD = "auth.password"
    EMAIL = "auth.email"
    
    # Projects
    PROJECT_CREATE = "projects.create"
    PROJECT_EDIT = "projects.edit"
    PROJECT_DELETE = "projects.delete"
    PROJECT_STATUS = "projects.status"
    PROJECT_TIMELINE = "projects.timeline"
    
    # Events
    EVENT_CREATE = "events.create"
    EVENT_EDIT = "events.edit"
    EVENT_DELETE = "events.delete"
    EVENT_REMINDER = "events.reminder"
    
    # Wiki
    WIKI_CREATE = "wiki.create"
    WIKI_EDIT = "wiki.edit"
    WIKI_DELETE = "wiki.delete"
    
    # Files
    FILE_UPLOAD = "files.upload"
    FILE_DELETE = "files.delete"
    FILE_DOWNLOAD = "files.download"
    
    # Notifications
    NOTIFICATION_NEW = "notifications.new"
    NOTIFICATION_READ = "notifications.read"
    NOTIFICATION_DELETE = "notifications.delete"

    # Error Messages
    ERROR_NOT_FOUND = "errors.not_found"
    ERROR_PERMISSION = "errors.permission"
    ERROR_VALIDATION = "errors.validation"
    ERROR_SERVER = "errors.server"
    
    # Success Messages
    SUCCESS_SAVE = "success.save"
    SUCCESS_DELETE = "success.delete"
    SUCCESS_UPDATE = "success.update"
    SUCCESS_CREATE = "success.create"

# Example usage in routes:
"""
from ..utils.i18n import translate, TranslationKeys

@router.get("/projects")
async def get_projects(request: Request):
    try:
        # ... get projects logic ...
        return {"message": translate(TranslationKeys.SUCCESS, request.state.language)}
    except Exception:
        return {"error": translate(TranslationKeys.ERROR_SERVER, request.state.language)}
"""
