# ═══════════════════════════════════════════════
# STAGE 1 : BUILD
# ═══════════════════════════════════════════════
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copie le csproj et restore (cache de couche optimisé)
COPY ["Apulse.API.csproj", "./"]
RUN dotnet restore "Apulse.API.csproj"

# Copie le reste et build
COPY . .
RUN dotnet publish "Apulse.API.csproj" -c Release -o /app/publish /p:UseAppHost=false
# ═══════════════════════════════════════════════
# STAGE 2 : RUNTIME (image légère sans SDK)
# ═══════════════════════════════════════════════
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Crée un user non-root (sécurité)
RUN adduser --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

COPY --from=build /app/publish .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "Apulse.Api.dll"]