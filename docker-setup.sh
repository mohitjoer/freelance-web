#!/bin/bash

# Docker Setup Script for Freelance Web Application
# This script helps you manage the Docker environment for the application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_status "Docker and Docker Compose are installed."
}

# Create environment file if it doesn't exist
setup_env() {
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from template..."
        cp env.example .env
        print_status "Created .env file from template. Please update it with your actual values."
        print_warning "Don't forget to add your Clerk API keys!"
    else
        print_status ".env file already exists."
    fi
}

# Build and start services
start_production() {
    print_header "Starting Production Environment"
    setup_env
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    print_status "Production environment started successfully!"
    print_status "Frontend: http://localhost:3000"
    print_status "WebSocket: http://localhost:4000"
    print_status "MongoDB: mongodb://localhost:27017"
}

# Start development environment
start_development() {
    print_header "Starting Development Environment"
    setup_env
    docker-compose -f docker-compose.dev.yml down
    docker-compose -f docker-compose.dev.yml build --no-cache
    docker-compose -f docker-compose.dev.yml up -d
    print_status "Development environment started successfully!"
    print_status "Frontend: http://localhost:3000 (with hot reload)"
    print_status "WebSocket: http://localhost:4000"
    print_status "MongoDB: mongodb://localhost:27017"
}

# Stop all services
stop_services() {
    print_header "Stopping All Services"
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    print_status "All services stopped."
}

# Clean up Docker resources
cleanup() {
    print_header "Cleaning Up Docker Resources"
    docker-compose down -v
    docker-compose -f docker-compose.dev.yml down -v
    docker system prune -f
    print_status "Docker cleanup completed."
}

# Show logs
show_logs() {
    if [ "$2" = "dev" ]; then
        docker-compose -f docker-compose.dev.yml logs -f
    else
        docker-compose logs -f
    fi
}

# Show status
show_status() {
    print_header "Docker Services Status"
    docker-compose ps
    echo ""
    docker-compose -f docker-compose.dev.yml ps
}

# Main script logic
case "$1" in
    "start")
        check_docker
        start_production
        ;;
    "dev")
        check_docker
        start_development
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        stop_services
        sleep 2
        start_production
        ;;
    "restart-dev")
        stop_services
        sleep 2
        start_development
        ;;
    "logs")
        show_logs "$@"
        ;;
    "status")
        show_status
        ;;
    "cleanup")
        cleanup
        ;;
    "help"|*)
        print_header "Freelance Web Application - Docker Management"
        echo "Usage: $0 {start|dev|stop|restart|restart-dev|logs|status|cleanup|help}"
        echo ""
        echo "Commands:"
        echo "  start       - Start production environment"
        echo "  dev         - Start development environment with hot reload"
        echo "  stop        - Stop all services"
        echo "  restart     - Restart production environment"
        echo "  restart-dev - Restart development environment"
        echo "  logs        - Show logs (add 'dev' for development logs)"
        echo "  status      - Show status of all services"
        echo "  cleanup     - Clean up Docker resources and volumes"
        echo "  help        - Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 start          # Start production"
        echo "  $0 dev            # Start development"
        echo "  $0 logs           # Show production logs"
        echo "  $0 logs dev       # Show development logs"
        ;;
esac
