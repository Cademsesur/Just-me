export default function AuthCodeError() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Erreur d'authentification</h1>
        <p className="text-muted-foreground mb-4">
          Une erreur s'est produite lors de la connexion.
        </p>
        <a href="/" className="text-primary hover:underline">
          Retour à l'accueil
        </a>
      </div>
    </div>
  )
}
