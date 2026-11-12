import React from 'react';
import { SchoolProfile } from '../data/bspData';
import {
  Building2,
  Calendar,
  UserCheck,
  FileText,
  RotateCcw,
  CheckCircle2,
  Award,
  ShieldCheck,
  MapPin,
  Hash,
  Users,
  PenTool,
} from 'lucide-react';

interface ProfileViewProps {
  schoolProfile: SchoolProfile;
  onUpdateProfile: (updated: Partial<SchoolProfile>) => void;
  onResetConclusion: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  schoolProfile,
  onUpdateProfile,
  onResetConclusion,
}) => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/20 text-sky-200 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 border border-sky-400/30">
            <Building2 className="w-4 h-4" />
            <span>ព័ត៌មានទូទៅ និងរចនាសម្ព័ន្ធសាលារៀន</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-amber-300 mb-2 font-moul">
            {schoolProfile.schoolName || 'សាលាបឋមសិក្សា'}
          </h1>
          <p className="text-slate-200 text-sm leading-relaxed">
            កំណត់អត្តសញ្ញាណសាលារៀន វដ្តផែនការយុទ្ធសាស្ត្រថវិការយៈពេល ៣ ឆ្នាំ (BSP)
            សមាសភាពគណៈកម្មការ និងសេចក្តីសន្និដ្ឋានរួមស្របតាមស្តង់ដាសាលារៀនគំរូទាំង ៥ របស់ក្រសួងអប់រំ យុវជន និងកីឡា។
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <Award className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section 1: School Identity */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-200">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">១. អត្តសញ្ញាណសាលារៀន</h2>
              <p className="text-xs text-slate-500">ឈ្មោះ ទីតាំងភូមិសាស្ត្រ និងលេខកូដសាលារៀន</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-sky-600" />
                <span>ឈ្មោះសាលារៀន (ភាសាខ្មែរ)</span>
              </label>
              <input
                type="text"
                value={schoolProfile.schoolName}
                onChange={(e) => onUpdateProfile({ schoolName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                placeholder="សាលាបឋមសិក្សា..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-indigo-600" />
                  <span>លេខកូដសាលារៀន (School Code)</span>
                </label>
                <input
                  type="text"
                  value={schoolProfile.schoolCode}
                  onChange={(e) => onUpdateProfile({ schoolCode: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-800 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  placeholder="SCH-..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  <span>កម្រងសាលារៀន (Cluster)</span>
                </label>
                <input
                  type="text"
                  value={schoolProfile.cluster}
                  onChange={(e) => onUpdateProfile({ cluster: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  placeholder="កម្រង..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  <span>ស្រុក / ខណ្ឌ</span>
                </label>
                <input
                  type="text"
                  value={schoolProfile.district}
                  onChange={(e) => onUpdateProfile({ district: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  placeholder="ស្រុក..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>រាជធានី / ខេត្ត</span>
                </label>
                <input
                  type="text"
                  value={schoolProfile.province}
                  onChange={(e) => onUpdateProfile({ province: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  placeholder="ខេត្ត..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Planning Cycle */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">២. វដ្តផែនការយុទ្ធសាស្ត្រថវិកា ៣ ឆ្នាំ</h2>
              <p className="text-xs text-slate-500">កំណត់ឆ្នាំមូលដ្ឋាន និងឆ្នាំគ្រោងថវិកា N+1, N+2, N+3</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-600 mb-1">ឆ្នាំមុន N-1</label>
                <input
                  type="number"
                  value={schoolProfile.yearNMinus1}
                  onChange={(e) => onUpdateProfile({ yearNMinus1: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">ឆ្នាំអនុវត្តកន្លងមក</span>
              </div>

              <div className="bg-indigo-50/60 p-3.5 rounded-xl border border-indigo-200">
                <label className="block text-xs font-bold text-indigo-900 mb-1">ឆ្នាំបច្ចុប្បន្ន N</label>
                <input
                  type="number"
                  value={schoolProfile.yearN}
                  onChange={(e) => onUpdateProfile({ yearN: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3 py-1.5 bg-white border border-indigo-300 rounded-lg text-sm font-bold text-indigo-950 focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[10px] text-indigo-600 mt-1 block">ឆ្នាំកំពុងអនុវត្ត</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-3">
                ឆ្នាំគ្រោងថវិកា ៣ ឆ្នាំទៅមុខ (BSP Cycle)
              </span>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  <label className="block text-xs font-bold text-emerald-900 mb-1">ឆ្នាំ N+1</label>
                  <input
                    type="number"
                    value={schoolProfile.yearN1}
                    onChange={(e) => onUpdateProfile({ yearN1: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-sm font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-emerald-700 font-medium mt-1 block">ច្បាប់ថវិកា</span>
                </div>

                <div className="bg-sky-50 p-3 rounded-xl border border-sky-200">
                  <label className="block text-xs font-bold text-sky-900 mb-1">ឆ្នាំ N+2</label>
                  <input
                    type="number"
                    value={schoolProfile.yearN2}
                    onChange={(e) => onUpdateProfile({ yearN2: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-2.5 py-1.5 bg-white border border-sky-300 rounded-lg text-sm font-bold text-sky-950 focus:ring-2 focus:ring-sky-500"
                  />
                  <span className="text-[10px] text-sky-700 font-medium mt-1 block">ឆ្នាំគ្រោងទី១</span>
                </div>

                <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
                  <label className="block text-xs font-bold text-purple-900 mb-1">ឆ្នាំ N+3</label>
                  <input
                    type="number"
                    value={schoolProfile.yearN3}
                    onChange={(e) => onUpdateProfile({ yearN3: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-2.5 py-1.5 bg-white border border-purple-300 rounded-lg text-sm font-bold text-purple-950 focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="text-[10px] text-purple-700 font-medium mt-1 block">ឆ្នាំគ្រោងទី២</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Governance Signatories & Approvals */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-lg">៣. គណៈកម្មការ និងហត្ថលេខីផ្លូវការ</h2>
            <p className="text-xs text-slate-500">
              សមាសភាពអ្នករៀបចំ អ្នកត្រួតពិនិត្យ និងការអនុម័តនៃផែនការយុទ្ធសាស្ត្រ
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <PenTool className="w-3.5 h-3.5 text-indigo-600" />
              <span>នាយក / នាយិកាសាលារៀន</span>
            </label>
            <input
              type="text"
              value={schoolProfile.principalName}
              onChange={(e) => onUpdateProfile({ principalName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="ឈ្មោះនាយកសាលា..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>ប្រធានគណៈកម្មការគ្រប់គ្រង</span>
            </label>
            <input
              type="text"
              value={schoolProfile.committeeChair}
              onChange={(e) => onUpdateProfile({ committeeChair: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              placeholder="ប្រធានគណៈកម្មការ..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>អ្នករៀបចំផែនការ</span>
            </label>
            <input
              type="text"
              value={schoolProfile.preparedBy}
              onChange={(e) => onUpdateProfile({ preparedBy: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
              placeholder="អ្នករៀបចំ..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>កាលបរិច្ឆេទអនុម័ត</span>
            </label>
            <input
              type="text"
              value={schoolProfile.approvalDate}
              onChange={(e) => onUpdateProfile({ approvalDate: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              placeholder="ថ្ងៃទី ... ខែ ... ឆ្នាំ ..."
            />
          </div>
        </div>
      </div>

      {/* Section 4: Conclusion & MoEYS Strategic Priorities */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">
                ៤. សេចក្តីសន្និដ្ឋានរួមនៃផែនការយុទ្ធសាស្ត្រថវិកា (Conclusion)
              </h2>
              <p className="text-xs text-slate-500">
                ការសង្ខេបអាទិភាពគន្លឹះទាំង ៥ ស្តង់ដា ដើម្បីសម្រេចបាននូវស្តង់ដាសាលារៀនគំរូ
              </p>
            </div>
          </div>

          <button
            onClick={onResetConclusion}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-all cursor-pointer border border-slate-300"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>កំណត់ឡើងវិញតាមគំរូដើម MoEYS</span>
          </button>
        </div>

        <div>
          <textarea
            rows={10}
            value={schoolProfile.conclusionNotes}
            onChange={(e) => onUpdateProfile({ conclusionNotes: e.target.value })}
            className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-sm leading-relaxed text-slate-800 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-sans"
            placeholder="បញ្ចូលសេចក្តីសន្និដ្ឋានរួម..."
          />
        </div>

        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
          <div className="text-xs text-sky-900 leading-relaxed">
            <span className="font-bold">ការណែនាំរបស់ក្រសួងអប់រំ យុវជន និងកីឡា៖</span>{' '}
            សេចក្តីសន្និដ្ឋាននេះនឹងត្រូវបានបង្ហាញក្នុងឯកសារបោះពុម្ពផ្លូវការ (Print View),
            ស្លាយធ្វើបទបង្ហាញជូនភាគីពាក់ព័ន្ធ (Slide Pitch View), និងរបាយការណ៍ពេញលេញ
            (Full Strategic Document) ដើម្បីរាយការណ៍ជូនការិយាល័យអប់រំ ស្រុក/ខណ្ឌ មន្ទីរអប់រំ និងក្រុមប្រឹក្សាឃុំ/សង្កាត់។
          </div>
        </div>
      </div>
    </div>
  );
};
