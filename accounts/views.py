from django.shortcuts import render
from django.views.generic.edit import CreateView
from django.contrib.auth.forms import UserCreationForm
from django.urls import reverse_lazy
from django.contrib import messages


class SignUpView(CreateView):
    """Inscription utilisateur."""
    form_class = UserCreationForm
    template_name = 'accounts/signup.html'
    success_url = reverse_lazy('accounts:login')

    def form_valid(self, form):
        messages.success(self.request, "✅ Compte créé avec succès ! Vous pouvez maintenant vous connecter.")
        return super().form_valid(form)
