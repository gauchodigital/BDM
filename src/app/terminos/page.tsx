import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description:
    "Aviso legal y términos de uso del sitio Basta de Meningitis (GSK Biopharma Argentina S.A.).",
};

const SECTIONS: { title?: string; paragraphs: string[] }[] = [
  {
    title: "Aviso legal",
    paragraphs: [
      'Este sitio web www.bastademeningitis.com.ar (el "Sitio" o el "Sitio web") es propiedad de GSK Biopharma Argentina S.A. ("GSK"), con domicilio legal en Libertador 7202, piso 4, Ciudad de Buenos Aires. Mediante el uso de este Sitio, usted acepta los Términos de Uso. No haga uso de este Sitio si no está de acuerdo.',
      "A su absoluta discreción, GSK se reserva el derecho a cambiar, modificar, agregar y eliminar partes de estos Términos de Uso en cualquier momento. Es su responsabilidad verificar periódicamente si se han realizado cambios en estos Términos de Uso. Usted podrá acceder a los Términos de Uso a través de un hipervínculo al pie de la página del Sitio. El uso continuo del Sitio luego de la actualización de los Términos de Uso significará que acepta cumplir con dichas revisiones.",
      "Los nombres y descripciones de los productos están dirigidos a las personas físicas residentes en Argentina. Los productos comercializados en otros países bajo la misma marca podrían tener fórmulas diferentes.",
      "GSK no se hace responsable por ningún daño que sea producto del acceso a este sitio o cualquier otro sitio vinculado, ni por el uso que se haga de la información contenida en este o cualquier otro sitio vinculado.",
    ],
  },
  {
    title: "Enlaces a sitios de terceros",
    paragraphs: [
      "A través de los vínculos o referencias que posee esta página de Internet, usted puede conectarse con otras páginas de GSK y/o de terceros. GSK no se responsabiliza por la información que pueda obtenerse en páginas de terceros que no estén bajo su tutela.",
      "Aunque GSK trata de facilitar el enlace con páginas de terceros que cumplen todos los requisitos y normas legales pertinentes, así como las normas de esta compañía, ha de entenderse que el contenido de dichas páginas de terceros puede variarse sin que GSK tenga conocimiento de ello. Por tanto, no podemos responsabilizarnos, ni aceptar ningún tipo de responsabilidad, de la información que se proporciona, ni de las opiniones que se expresan en las páginas de Internet de terceros, como así tampoco por la disponibilidad de los contenidos de los mismos o por los daños y perjuicios que pudieran resultar de su uso.",
    ],
  },
  {
    title: "Información no médica",
    paragraphs: [
      "La información contenida en este sitio de Internet no debe ser tomada como consejo médico, diagnóstico o tratamiento. El contenido de este sitio de Internet en ninguna forma pretende proporcionar una respuesta o solución a problemas de salud de las personas. Tampoco proporciona diagnósticos, tratamientos o formas de prescribir el producto para cada caso particular, por lo que se recomienda que todo y cualquier paciente siempre sea atendido y tratado directamente por un especialista de la salud.",
      "Nada de la presente página supone un asesoramiento, calificación o sugerencia de compra o de venta. La información que Ud. encontrará en este sitio web no sustituye la consulta profesional. Publicamos la misma con el entendimiento de que no será interpretada como consejo médico o profesional. Toda la información brindada necesita ser revisada cuidadosamente por usted y su médico. No debe desacreditar o dilatar la consulta de un médico por causa de cualquier información contenida en este sitio de Internet.",
      "En concreto, los resultados y los hechos reales puede que sean totalmente distintos a los previstos o esperados en esta página de Internet, por lo que su valoración en el pasado no debe constituir ningún tipo de base o guía sobre la que puedan tener en el futuro.",
    ],
  },
  {
    title: "Actualización del contenido",
    paragraphs: [
      "El autor de la información contenida en este sitio de Internet (GSK), y/o cualquier otra persona o institución que intervenga o haya intervenido en su preparación, difusión y/o estén involucradas en cualquier otra forma con ésta, se reservan el derecho de actualizar, cancelar y/o de cualquier forma modificar en todo momento el contenido total o parcial de dicha información, sin previo aviso y sin responsabilidad alguna.",
    ],
  },
  {
    title: "Cuentas de usuario",
    paragraphs: [
      "Si decide abrir una cuenta (incluida la configuración de un usuario y contraseña), usted es responsable de mantener la confidencialidad de la información de su cuenta y toda la actividad que se produzca en su cuenta.",
    ],
  },
  {
    title: "Propiedad intelectual",
    paragraphs: [
      "Los derechos de propiedad intelectual y cualesquiera otros derechos sobre el material contenido en esta página web pertenecen exclusivamente a GSK y se encuentran protegidos por la legislación sobre propiedad intelectual. No se permite la reproducción total o parcial de este sitio, ni su traducción, ni su incorporación a un sistema informático, ni su locación, ni su transmisión en cualquier forma o por cualquier medio, sea éste electrónico, mecánico, por fotocopia, por grabación, u otros métodos, sin el previo y expreso consentimiento de GSK. La violación de cualquiera de estos derechos exclusivos de GSK constituye una violación e implica responsabilidad del infractor que dará lugar a sanciones civiles o criminales.",
      "GSK solo autoriza a utilizar copias de los documentos e información contenidos en esta página web con fines exclusivamente privados y domésticos. Cualquier copia, reproducción, distribución, publicación, descarga, exhibición, publicación, transmisión o utilización de copias con fines distintos está expresamente prohibido. El contenido de la información no puede ser modificada, distribuida, reenviada, transmitida, reutilizada para fines comerciales y/o públicos, sin el consentimiento expreso de GSK.",
      "Excepto por cuanto expresamente se ha especificado anteriormente, nada de cuanto aquí se incluye confiere ningún tipo de licencia o derecho en virtud de los derechos de propiedad intelectual que posee GSK. Asimismo, nada de cuanto aquí se dice ha de entenderse que confiera, de forma implícita, por exclusión o de otra forma, licencia o derecho a terceros sobre cualquier patente, derecho de autor o marca de GSK.",
    ],
  },
  {
    title: "Marcas",
    paragraphs: [
      'Las marcas, marcas de servicios, logos e isologotipos ("Marcas") de GSK contenidas en esta página web son propiedad de GSK. GSK no reivindica la propiedad de las marcas registradas de terceros que aparecen en la presente página. Dichas marcas registradas únicamente se utilizan con el fin de identificar los productos y los servicios de sus respectivos propietarios, y no debe deducirse del empleo de estas marcas que GSK las promocione o las avale. Específicamente, no se podrá utilizar la Marca GSK de manera alguna, sin consentimiento del titular de la Marca.',
      "El usuario reconoce y acepta que todos los derechos intelectuales e industriales del sitio de Internet (incluyendo sin limitación derechos sobre las marcas, propiedad intelectual, derecho de autor, derecho industrial, patentes y demás derechos patrimoniales y morales), son y serán considerados de propiedad exclusiva de GSK.",
    ],
  },
  {
    title: "Información enviada por el usuario",
    paragraphs: [
      "En caso que cualquier persona entregue a GSK a través de esta página web cualquier tipo de información, incluyendo sugerencias, planes, ideas, conceptos, experiencias, técnicas, comentarios, preguntas o respuestas, la persona declara que dicha información no es confidencial y que cede todos sus derechos sobre dicho material a GSK, y que por lo tanto, los derechos de propiedad industrial e intelectual sobre este material son de exclusiva propiedad de GSK. De la misma manera, la persona declara que renuncia completa e irrevocablemente a invocar lesión alguna sobre derechos de paternidad y/o integridad sobre la información, sugerencias, planes, ideas, conceptos, experiencias, técnicas, comentarios, preguntas o respuestas entregadas a GSK.",
      "Por ello, GSK tendrá derechos de carácter ilimitado para usar o no usar, distribuir o no distribuir, reproducir o no reproducir y revelar o no revelar toda información y material entregado de la forma y modo que GSK pueda considerar apropiado con cualquier fin o propósito, incluyendo pero sin limitarse al desarrollo, fabricación y la comercialización de productos que de alguna manera sean fruto de dicha información, sin que ello genere derecho a indemnización o compensación alguna ni a reconocimiento de su fuente.",
      "El autor de la información contenida en este sitio de Internet (GSK), y/o cualquier otra persona o institución que intervenga o haya intervenido en su preparación, difusión y/o estén involucradas en cualquier otra forma con ésta, se reservan el derecho de utilizar, cancelar y/o de cualquier forma modificar en todo momento el contenido total o parcial de dicha información, sin previo aviso y sin responsabilidad alguna.",
    ],
  },
];

export default function TerminosPage() {
  return (
    <Section tone="white" className="!pt-12 md:!pt-16">
      <SectionHeading title="Términos y condiciones" />
      <div className="mx-auto max-w-2xl space-y-10">
        {SECTIONS.map((section) => (
          <section key={section.title ?? section.paragraphs[0]?.slice(0, 24)}>
            {section.title ? (
              <h2 className="mb-3 text-[18px] font-bold leading-snug text-[#503C77]">
                {section.title}
              </h2>
            ) : null}
            <div className="space-y-4 text-[15px] leading-[1.65] text-[#442748]">
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 64)}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Section>
  );
}
