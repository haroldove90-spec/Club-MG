import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Briefcase,
  ShieldCheck,
  Printer,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Download,
  Users,
  Building,
  Check,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { STPSCertificate, Employee } from '../../types';

export const STPSComplianceModule: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    stpsCertificates,
    employees,
    nomAudits,
  } = useApp();

  const [selectedCert, setSelectedCert] = useState<STPSCertificate | null>(stpsCertificates[0] || null);
  const [empSearch, setEmpSearch] = useState('');
  const [selectedEmployeeForMatriz, setSelectedEmployeeForMatriz] = useState<Employee | null>(null);

  const filteredEmployees = employees.filter((emp) =>
    emp.fullName.toLowerCase().includes(empSearch.toLowerCase()) ||
    emp.role.toLowerCase().includes(empSearch.toLowerCase()) ||
    emp.department.toLowerCase().includes(empSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner with STPS Official Badge & Amber Accents */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-amber-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              Módulo 4 • Normativa STPS / CONOCER
            </span>
            <span className="text-xs text-amber-800 font-semibold">Marco Jurídico Laboral México</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Auditoría de Capacitación & Certificaciones Oficiales
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Formato DC-3, Estándares de Competencia CONOCER (EC0217 & EC0076) y Matriz de los 25 Colaboradores
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">Módulo Activo</span>
            <span className="text-xs font-bold text-amber-950 capitalize">
              {activeTab === 'dc3' && 'Formato DC-3 Oficial'}
              {activeTab === 'conocer' && 'Estándares CONOCER'}
              {activeTab === 'matriz-empleados' && 'Matriz 25 Colaboradores'}
              {activeTab === 'seguridad-higiene' && 'Auditoría NOMs STPS'}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. FORMATO DC-3 OFICIAL STPS                                              */}
      {/* ========================================================================= */}
      {activeTab === 'dc3' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Certificate Selector & Summary List */}
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Constancias DC-3 Registradas</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                {stpsCertificates.length} Emitidas
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Selecciona una constancia para previsualizar el documento oficial oficial listo para firma o inspección.
            </p>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {stpsCertificates.map((cert) => {
                const isSelected = selectedCert?.id === cert.id;
                return (
                  <div
                    key={cert.id}
                    onClick={() => setSelectedCert(cert)}
                    className={`p-3 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-400'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-100/80 px-1.5 py-0.5 rounded">
                        {cert.folioDC3}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{cert.hours} hrs</span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 mt-1">{cert.workerName}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-1">{cert.courseName}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">CURP: {cert.workerCurp}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Official DC-3 Paper Form Preview */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-300 shadow-md p-4 sm:p-8 space-y-6 text-slate-900 text-xs overflow-hidden">
            {selectedCert ? (
              <>
                {/* Government Format Header */}
                <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      SECRETARÍA DEL TRABAJO Y PREVISIÓN SOCIAL
                    </span>
                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Imprimir DC-3</span>
                    </button>
                  </div>

                  <h2 className="text-base sm:text-lg font-black tracking-tight uppercase">
                    FORMATO DC-3
                  </h2>
                  <h3 className="text-xs sm:text-sm font-bold uppercase text-slate-700">
                    CONSTANCIA DE COMPETENCIAS O DE HABILIDADES LABORALES
                  </h3>
                  <div className="text-[10px] font-mono text-slate-500">
                    Folio de Registro STPS: <strong>{selectedCert.folioDC3}</strong>
                  </div>
                </div>

                {/* Section I: Worker Data */}
                <div className="space-y-2 border border-slate-300 rounded-lg p-3.5 bg-slate-50/50">
                  <div className="font-bold uppercase text-[11px] text-amber-900 flex items-center gap-1.5 border-b border-slate-200 pb-1">
                    <span>I. DATOS DEL TRABAJADOR</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Nombre (Apellido paterno, materno y nombre(s)):</span>
                      <strong className="text-xs uppercase">{selectedCert.workerName}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Clave Única de Registro de Población (CURP):</span>
                      <strong className="text-xs font-mono">{selectedCert.workerCurp}</strong>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[10px] text-slate-500 block">Ocupación Específica (Catálogo Nacional de Ocupaciones):</span>
                      <strong className="text-xs uppercase">{selectedCert.occupation}</strong>
                    </div>
                  </div>
                </div>

                {/* Section II: Company Data */}
                <div className="space-y-2 border border-slate-300 rounded-lg p-3.5 bg-slate-50/50">
                  <div className="font-bold uppercase text-[11px] text-amber-900 flex items-center gap-1.5 border-b border-slate-200 pb-1">
                    <span>II. DATOS DE LA EMPRESA</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Nombre o Razón Social:</span>
                      <strong className="text-xs uppercase">{selectedCert.companyName}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Registro Federal de Contribuyentes (RFC):</span>
                      <strong className="text-xs font-mono">{selectedCert.companyRfc}</strong>
                    </div>
                  </div>
                </div>

                {/* Section III: Training Program Data */}
                <div className="space-y-2 border border-slate-300 rounded-lg p-3.5 bg-slate-50/50">
                  <div className="font-bold uppercase text-[11px] text-amber-900 flex items-center gap-1.5 border-b border-slate-200 pb-1">
                    <span>III. DATOS DEL PROGRAMA DE CAPACITACIÓN, ADIESTRAMIENTO Y PRODUCTIVIDAD</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="sm:col-span-3">
                      <span className="text-[10px] text-slate-500 block">Nombre del Curso:</span>
                      <strong className="text-xs uppercase">{selectedCert.courseName}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Duración en Horas:</span>
                      <strong className="text-xs font-mono">{selectedCert.hours} horas acreditadas</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Periodo de Ejecución:</span>
                      <strong className="text-xs font-mono">{selectedCert.startDate} al {selectedCert.endDate}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Área Temática STPS:</span>
                      <strong className="text-xs uppercase">{selectedCert.thematicArea}</strong>
                    </div>
                    <div className="sm:col-span-3">
                      <span className="text-[10px] text-slate-500 block">Agente Capacitador / Instructor Registrado:</span>
                      <strong className="text-xs uppercase">{selectedCert.instructorName}</strong>
                    </div>
                  </div>
                </div>

                {/* Section IV: Regulatory Signatures */}
                <div className="pt-4 border-t-2 border-slate-900">
                  <div className="text-[10px] text-center text-slate-500 font-bold uppercase mb-4">
                    LOS FIRMANTES DECLARAN BAJO PROTESTA DE DECIR VERDAD QUE LA INFORMACIÓN ASENTADA ES VERÍDICA
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="space-y-1">
                      <div className="h-14 border-b border-slate-400 flex items-end justify-center pb-1">
                        <span className="text-[10px] font-mono text-slate-400 italic">[Firma Digital]</span>
                      </div>
                      <strong className="text-[10px] block uppercase">{selectedCert.instructorName}</strong>
                      <span className="text-[9px] text-slate-500 block">Instructor o Tutor Capacitador</span>
                    </div>

                    <div className="space-y-1">
                      <div className="h-14 border-b border-slate-400 flex items-end justify-center pb-1">
                        <span className="text-[10px] font-mono text-slate-400 italic">[Firma Digital]</span>
                      </div>
                      <strong className="text-[10px] block uppercase">{selectedCert.legalRepresentative}</strong>
                      <span className="text-[9px] text-slate-500 block">Patrón o Representante Legal</span>
                    </div>

                    <div className="space-y-1">
                      <div className="h-14 border-b border-slate-400 flex items-end justify-center pb-1">
                        <span className="text-[10px] font-mono text-slate-400 italic">[Firma Digital]</span>
                      </div>
                      <strong className="text-[10px] block uppercase">{selectedCert.workerRepresentative}</strong>
                      <span className="text-[9px] text-slate-500 block">Representante de los Trabajadores</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400">
                Selecciona una constancia para visualizar el documento.
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ESTÁNDARES CONOCER (EC0217 & EC0076)                                   */}
      {/* ========================================================================= */}
      {activeTab === 'conocer' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Standard EC0217.01 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-lg border border-amber-200">
                  EC0217
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Estándar Activo
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900">
                  EC0217.01 • Impartición de Cursos de Formación del Capital Humano
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Modalidad presencial y grupal. Norma oficial de competencia laboral emitida por el Consejo Nacional de Normalización y Certificación de Competencias Laborales (CONOCER).
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <span className="font-bold text-slate-700 block">Personal Club MG Certificado en EC0217.01:</span>
                <div className="space-y-1.5">
                  {[
                    { name: 'Oscar Patiño Morales', role: 'Gerente de Operación', folio: 'CONOCER-C0982-2023' },
                    { name: 'Brenda Esquivel Pineda', role: 'Coordinadora de Fitness', folio: 'CONOCER-C1102-2024' },
                    { name: 'Javier Domínguez Silva', role: 'Coach Senior Cross', folio: 'CONOCER-C1491-2024' },
                  ].map((inst, i) => (
                    <div key={i} className="p-2 bg-slate-50 rounded-lg flex items-center justify-between">
                      <div>
                        <strong className="text-slate-900 block">{inst.name}</strong>
                        <span className="text-slate-500 text-[11px]">{inst.role}</span>
                      </div>
                      <span className="font-mono text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {inst.folio}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Standard EC0076 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold text-lg border border-blue-200">
                  EC0076
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Estándar Activo
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900">
                  EC0076 • Evaluación de la Competencia de Candidatos
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Evaluador oficial de competencias con base en estándares establecidos. Garantiza que las valoraciones técnicas del personal cuenten con validez curricular ante la SEP-CONOCER.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <span className="font-bold text-slate-700 block">Evaluadores Certificados en Club MG:</span>
                <div className="space-y-1.5">
                  {[
                    { name: 'Oscar Patiño Morales', role: 'Evaluador Independiente', folio: 'CONOCER-E0076-2022' },
                    { name: 'Dr. Samuel Rincón Vega', role: 'Médico del Deporte', folio: 'CONOCER-E0076-2023' },
                  ].map((inst, i) => (
                    <div key={i} className="p-2 bg-slate-50 rounded-lg flex items-center justify-between">
                      <div>
                        <strong className="text-slate-900 block">{inst.name}</strong>
                        <span className="text-slate-500 text-[11px]">{inst.role}</span>
                      </div>
                      <span className="font-mono text-[10px] text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {inst.folio}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MATRIZ DE LOS 25 EMPLEADOS DEL CLUB                                    */}
      {/* ========================================================================= */}
      {activeTab === 'matriz-empleados' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Matriz de Cumplimiento Laboral • Plantilla 25 Trabajadores
              </h3>
              <p className="text-xs text-slate-500">
                Control de expedientes de capacitación, constancias DC-3 y asignaciones por departamento
              </p>
            </div>

            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="Filtrar por nombre o puesto..."
                value={empSearch}
                onChange={(e) => setEmpSearch(e.target.value)}
                className="w-full py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-amber-50/70 border-b border-amber-200 text-amber-950 text-[11px] font-bold uppercase">
                    <th className="py-3 px-4">No. / Colaborador</th>
                    <th className="py-3 px-4">Puesto & Departamento</th>
                    <th className="py-3 px-4">CURP</th>
                    <th className="py-3 px-4">Certificaciones STPS</th>
                    <th className="py-3 px-4">CONOCER</th>
                    <th className="py-3 px-4 text-center">Expediente</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{emp.fullName}</div>
                        <div className="font-mono text-[10px] text-slate-400">{emp.employeeNumber}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{emp.role}</div>
                        <div className="text-[11px] text-slate-500">{emp.department} • Turno {emp.shift}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        {emp.curp}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {emp.stpsCertifications.map((cert, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200"
                            >
                              {cert}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {emp.conocerStandards.length > 0 ? (
                            emp.conocerStandards.map((std, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200"
                              >
                                {std}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">En programa anual</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Completo</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. AUDITORÍA NOMS STPS                                                    */}
      {/* ========================================================================= */}
      {activeTab === 'seguridad-higiene' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nomAudits.map((nom, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {nom.nom}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    nom.status === 'Cumplimiento Total'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-300'
                  }`}>
                    {nom.complianceScore}%
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900">{nom.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{nom.evidence}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between text-[11px] text-slate-400">
                  <span>Última inspección interna:</span>
                  <span className="font-mono text-slate-600">{nom.lastAudit}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-amber-900 to-slate-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs font-mono text-amber-300 uppercase tracking-wider font-bold">
                DIAGNÓSTICO DE PREPARACIÓN PARA INSPECCIÓN FEDERAL
              </div>
              <h3 className="text-lg sm:text-xl font-bold">
                Índice Global de Cumplimiento STPS: 88%
              </h3>
              <p className="text-xs text-slate-300 max-w-xl">
                La Comisión Mixta de Capacitación y Adiestramiento cuenta con las actas constitutivas, los planes y programas anuales y los formatos DC-3 validados para los 25 trabajadores del centro deportivo.
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition whitespace-nowrap"
            >
              Exportar Dictamen de Auditoría
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
