export default function AdminStubPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-3 p-8 text-center">
      <h1 className="text-xl font-bold text-[#3d2d5c]">Admin no disponible</h1>
      <p className="text-sm text-[#6b6578]">
        En el deploy estático (FTP) el panel de edición en vivo no aplica. El
        contenido se actualiza en el proyecto y se vuelve a generar la carpeta{" "}
        <code>out/</code>.
      </p>
      <a href="/" className="text-sm font-semibold text-[#503C77] underline">
        Volver al sitio
      </a>
    </div>
  );
}
