from django.db.models import Q
from django.shortcuts import render
from .models import Journal, Category
from rest_framework import generics

from .serializers import JournalSerializer


def filters(request):
    def is_valid_queryparam(param):
        return param != '' and param is not None

    qs = Journal.objects.all()
    title_contains = request.GET.get('title_contains')
    categories = Category.objects.all()
    title_exact = request.GET.get('title_exact')
    title_or_author = request.GET.get('title_or_author')
    view_count_min = request.GET.get('view_count_min')
    view_count_max = request.GET.get('view_count_max')
    date_min = request.GET.get('date_min')
    date_max = request.GET.get('date_max')
    category = request.GET.get('category')
    reviewed = request.GET.get('reviewed')
    not_reviewed = request.GET.get('not_reviewed')

    if is_valid_queryparam(title_contains):
        qs = qs.filter(title__icontains=title_contains)

    elif is_valid_queryparam(title_exact):
        qs = qs.filter(id=title_exact)

    elif is_valid_queryparam(title_or_author):
        qs = qs.filter(Q(title__icontains=title_or_author) |
                       Q(author__name__icontains=title_or_author)).distinct()

    if is_valid_queryparam(view_count_min):
        qs = qs.filter(views__gte=view_count_min)

    if is_valid_queryparam(view_count_max):
        qs = qs.filter(views__lt=view_count_max)

    if is_valid_queryparam(date_min):
        qs = qs.filter(publish_date__gte=date_min)

    if is_valid_queryparam(date_max):
        qs = qs.filter(publish_date__lt=date_max)

    if is_valid_queryparam(category) and category != 'Choose...':
        qs = qs.filter(categories__name=category)

    if reviewed == 'on':
        qs = qs.filter(reviewed=True)

    elif not_reviewed == 'on':
        qs = qs.filter(reviewed=False)

    return qs


def BootstrapFilterView(request):
    qs = filters(request)
    context = {
        'queryset': qs,
        'categories': Category.objects.all()
    }
    return render(request, '../templates/bootstrap_form.html', context)


class ReactFilterView(generics.ListAPIView):
    serializer_class = JournalSerializer

    def get_queryset(self):
        qs = filters(self.request)
        return qs
