"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FileText, CheckCircle, AlertCircle, Loader2, ArrowLeft, Camera } from "lucide-react";
import Link from "next/link";
import PageLayout from "@/app/components/PageLayout";

interface ContractType {
  id: string;
  title: string;
  content: string;
  type: string;
}

const DEFAULT_CONTRACTS: ContractType[] = [
  {
    id: "terms",
    title: "Termos de Uso e Prestação de Serviços",
    type: "terms",
    content: `
<h2>TERMOS DE USO E CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h2>
<p class="date">Última atualização: ${new Date().toLocaleDateString('pt-BR')}</p>

<h3>1. DAS PARTES</h3>
<p>De um lado, <strong>UNIVERSO DE CANTORES</strong>, empresa especializada em educação vocal e técnica de canto, doravante denominada "CONTRATADA", e de outro lado, o usuário cadastrado na plataforma, doravante denominado "ALUNO".</p>

<h3>2. DO OBJETO</h3>
<p>O presente contrato tem por objeto a prestação de serviços de aulas de canto online, acesso a materiais didáticos (kits de ensaio), acompanhamento vocal personalizado e demais recursos disponibilizados na plataforma.</p>

<h3>3. DAS AULAS</h3>
<p>3.1. As aulas serão realizadas através da plataforma de videoconferência integrada ao sistema.</p>
<p>3.2. O aluno deverá preencher o briefing pré-aula informando seu estado emocional, físico e objetivos específicos.</p>
<p>3.3. A duração padrão de cada aula é de 60 (sessenta) minutos.</p>
<p>3.4. Reagendamentos devem ser solicitados com no mínimo 24 horas de antecedência.</p>
<p>3.5. Faltas não comunicadas com a devida antecedência serão consideradas aulas realizadas.</p>

<h3>4. DO PAGAMENTO</h3>
<p>4.1. Os valores e formas de pagamento estão descritos no plano contratado.</p>
<p>4.2. O pagamento deve ser efetuado antes da realização das aulas.</p>
<p>4.3. Aulas não utilizadas dentro do período de validade não serão reembolsadas.</p>

<h3>5. DA POLÍTICA DE CANCELAMENTO</h3>
<p>5.1. O aluno pode cancelar seu plano a qualquer momento.</p>
<p>5.2. No caso de cancelamento, não haverá reembolso de aulas já pagas ou vencidas.</p>
<p>5.3. Aulas agendadas podem ser reagendadas conforme item 3.4.</p>

<h3>6. DAS RESPONSABILIDADES DO ALUNO</h3>
<p>6.1. Manter seus dados cadastrais atualizados.</p>
<p>6.2. Comparecer às aulas agendadas ou comunicar ausência com antecedência.</p>
<p>6.3. Utilizar a plataforma de forma ética e respeitosa.</p>
<p>6.4. Praticar os exercícios recomendados entre as aulas.</p>

<h3>7. DAS RESPONSABILIDADES DA CONTRATADA</h3>
<p>7.1. Fornecer aulas de qualidade com professor qualificado.</p>
<p>7.2. Disponibilizar acesso aos recursos da plataforma.</p>
<p>7.3. Emitir relatórios de evolução após cada aula.</p>
<p>7.4. Manter a confidencialidade dos dados do aluno conforme LGPD.</p>

<h3>8. DA LGPD</h3>
<p>8.1. Os dados pessoais serão tratados conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018).</p>
<p>8.2. O aluno autoriza o armazenamento e processamento de seus dados para fins de prestação do serviço.</p>
<p>8.3. Os dados não serão compartilhados com terceiros sem consentimento expresso.</p>

<h3>9. DISPOSIÇÕES GERAIS</h3>
<p>9.1. Este contrato tem validade enquanto perdurar a relação comercial entre as partes.</p>
<p>9.2. Quaisquer alterações neste contrato serão comunicadas previamente ao aluno.</p>
<p>9.3. Fica eleito o foro da comarca de São Paulo/SP para dirimir quaisquer questões oriundas deste contrato.</p>
`
  },
  {
    id: "image",
    title: "Autorização de Uso de Imagem",
    type: "image",
    content: `
<h2>TERMO DE AUTORIZAÇÃO DE USO DE IMAGEM E VOZ</h2>
<p class="date">Última atualização: ${new Date().toLocaleDateString('pt-BR')}</p>

<h3>AUTORIZAÇÃO</h3>
<p>Eu, na qualidade de aluno(a) da plataforma <strong>UNIVERSO DE CANTORES</strong>, autorizo de forma gratuita e por prazo indeterminado a utilização da minha imagem e voz, captadas durante as aulas ou em materiais produzidos para a plataforma, para os seguintes fins:</p>

<ul>
  <li>Divulgação institucional nas redes sociais da empresa</li>
  <li>Material promocional e publicitário</li>
  <li>Portfólio de trabalhos realizados</li>
  <li>Depoimentos e cases de sucesso</li>
  <li>Conteúdo educacional no canal do YouTube</li>
</ul>

<h3>CONDIÇÕES</h3>
<p>1. A presente autorização é concedida a título gratuito, não gerando qualquer tipo de ônus financeiro para o <strong>UNIVERSO DE CANTORES</strong>.</p>

<p>2. A autorização poderá ser revogada a qualquer momento mediante solicitação por escrito, sendo que o material já publicado até a data da revogação poderá permanecer em exibição.</p>

<p>3. Fica garantido o direito ao anonimato, caso solicitado, em materiais que ainda serão produzidos.</p>

<p>4. O <strong>UNIVERSO DE CANTORES</strong> compromete-se a utilizar a imagem e voz de forma ética, respeitosa e sem qualquer conotação pejorativa ou depreciativa.</p>

<h3>DECLARAÇÃO</h3>
<p>Declaro que li e compreendi os termos desta autorização e concordo com todas as condições estabelecidas.</p>
`
  }
];

function ContratosContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const contractType = searchParams.get("type") || "all";
  
  const [contracts, setContracts] = useState<ContractType[]>(DEFAULT_CONTRACTS);
  const [selectedContract, setSelectedContract] = useState<ContractType | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedImage, setAcceptedImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [signedContracts, setSignedContracts] = useState<string[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    // Carregar contratos já assinados
    if (session?.user?.email) {
      fetch("/api/contracts/signed")
        .then(res => res.json())
        .then(data => {
          if (data.contracts) {
            setSignedContracts(data.contracts.map((c: any) => c.type));
          }
        })
        .catch(() => {});
    }
  }, [status, router, session]);

  const handleSign = async () => {
    if (!selectedContract) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/contracts/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedContract.type,
          title: selectedContract.title,
          content: selectedContract.content,
          imageRightsConsent: selectedContract.type === "image",
          lgpdConsent: true
        })
      });

      if (res.ok) {
        setSuccess(true);
        setSignedContracts([...signedContracts, selectedContract.type]);
        setTimeout(() => {
          setSuccess(false);
          setSelectedContract(null);
          setAcceptedTerms(false);
          setAcceptedImage(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Erro ao assinar:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors text-sm mb-4"
          >
            <ArrowLeft size={16} />
            Voltar ao Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
            Contratos e Termos
          </h1>
          <p className="text-[var(--foreground-muted)] mt-2">
            Leia e aceite os contratos necessários para utilizar a plataforma.
          </p>
        </div>

        {/* Lista de Contratos */}
        {!selectedContract ? (
          <div className="grid gap-4">
            {contracts.map((contract) => {
              const isSigned = signedContracts.includes(contract.type);
              return (
                <div
                  key={contract.id}
                  className={`bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 transition-all ${
                    isSigned ? "opacity-75" : "hover:shadow-lg cursor-pointer"
                  }`}
                  onClick={() => !isSigned && setSelectedContract(contract)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        contract.type === "terms" ? "bg-purple-100 text-purple-600" : "bg-pink-100 text-pink-600"
                      }`}>
                        {contract.type === "terms" ? <FileText size={24} /> : <Camera size={24} />}
                      </div>
                      <div>
                        <h3 className="font-bold text-[var(--foreground)]">{contract.title}</h3>
                        <p className="text-sm text-[var(--foreground-muted)]">
                          {isSigned ? "✓ Assinado" : "Clique para ler e assinar"}
                        </p>
                      </div>
                    </div>
                    {isSigned ? (
                      <CheckCircle className="text-green-500" size={24} />
                    ) : (
                      <AlertCircle className="text-amber-500" size={24} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Visualização do Contrato */
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl overflow-hidden">
            {/* Header do Contrato */}
            <div className="bg-gradient-to-r from-[#7732A6] to-[#F252BA] p-6 text-white">
              <button
                onClick={() => {
                  setSelectedContract(null);
                  setAcceptedTerms(false);
                  setAcceptedImage(false);
                }}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm mb-4"
              >
                <ArrowLeft size={16} />
                Voltar
              </button>
              <h2 className="text-2xl font-bold" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                {selectedContract.title}
              </h2>
            </div>

            {/* Conteúdo do Contrato */}
            <div 
              className="p-6 md:p-8 max-h-[50vh] overflow-y-auto prose prose-slate max-w-none contract-content"
              dangerouslySetInnerHTML={{ __html: selectedContract.content }}
            />

            {/* Aceite */}
            <div className="p-6 border-t border-[var(--card-border)] bg-[var(--background-secondary)]">
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-[var(--foreground)]">
                    <strong>Li e aceito</strong> os termos descritos acima. Declaro que estou ciente de todas as condições e concordo em cumpri-las.
                  </span>
                </label>

                {selectedContract.type === "image" && (
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={acceptedImage}
                      onChange={(e) => setAcceptedImage(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                    <span className="text-sm text-[var(--foreground)]">
                      <strong>Autorizo</strong> o uso da minha imagem e voz conforme descrito neste termo.
                    </span>
                  </label>
                )}
              </div>

              <button
                onClick={handleSign}
                disabled={loading || !acceptedTerms || (selectedContract.type === "image" && !acceptedImage)}
                className={`w-full mt-6 py-4 px-6 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                  success
                    ? "bg-green-500"
                    : acceptedTerms && (selectedContract.type !== "image" || acceptedImage)
                      ? "bg-gradient-to-r from-[#7732A6] to-[#F252BA] hover:opacity-90"
                      : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : success ? (
                  <>
                    <CheckCircle size={20} />
                    Contrato Assinado!
                  </>
                ) : (
                  <>
                    <FileText size={20} />
                    Assinar Contrato
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Informação sobre contratos */}
        <div className="mt-8 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
          <p className="text-sm text-purple-700 dark:text-purple-300">
            <strong>Importante:</strong> A assinatura destes contratos é necessária para a utilização completa dos serviços da plataforma. 
            Seus dados são protegidos conforme a LGPD.
          </p>
        </div>

      </div>
    </div>
  );
}

export default function ContratosPage() {
  return (
    <PageLayout>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-purple-600" size={40} />
        </div>
      }>
        <ContratosContent />
      </Suspense>

      <style jsx global>{`
        .contract-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--foreground);
        }
        .contract-content h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: var(--foreground);
        }
        .contract-content p {
          margin-bottom: 0.75rem;
          color: var(--foreground-muted);
          line-height: 1.7;
        }
        .contract-content ul {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }
        .contract-content li {
          margin-bottom: 0.5rem;
          color: var(--foreground-muted);
        }
        .contract-content .date {
          color: var(--foreground-muted);
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
        }
      `}</style>
    </PageLayout>
  );
}
