from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from django.views.generic import TemplateView

from core.views import BootstrapFilterView, ReactFilterView

urlpatterns = [
    path('api-auth/', include('rest_framework.urls')),
    path('rest-auth/', include('rest_auth.urls')),
    path('rest-auth/registration/', include('rest_auth.registration.urls')),
    path('admin/', admin.site.urls),
    path('', BootstrapFilterView, name='bootstrap'),
    path('api/', ReactFilterView.as_view(), name='react'),
    re_path(r'^react/', TemplateView.as_view(template_name='index.html')),
]
