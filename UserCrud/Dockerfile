# Стейдж 1: Базовый образ для запуска
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
# В .NET 8/9/10 по умолчанию используется порт 8080
EXPOSE 8080
EXPOSE 8081

# Стейдж 2: Сборка
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
# Создаем папку /src ВНУТРИ контейнера (на твоем ПК она не нужна)
WORKDIR /src

# Копируем файл проекта. 
# В контексте папки UserCrud он лежит прямо тут, поэтому путь просто "UserCrud.csproj"
COPY ["UserCrud.csproj", "./"]
RUN dotnet restore "UserCrud.csproj"

# Копируем все остальные файлы из папки UserCrud в контейнер
COPY . .

# Собираем проект
RUN dotnet build "UserCrud.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Стейдж 3: Публикация
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "UserCrud.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Стейдж 4: Финальный образ
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "UserCrud.dll"]