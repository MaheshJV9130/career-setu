'use client'

import React, { useMemo, useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  BarChart3, BookOpen, ChevronDown, CircleAlert, Compass, GraduationCap, Home,
  Languages, LogOut, MapPin, Menu, ShieldCheck, Sparkles, Target, TrendingUp,
  UserRound, X
} from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'

import { HomeView } from '@/components/views/HomeView'
import { DiscoverView } from '@/components/views/DiscoverView'
import { ReadinessView } from '@/components/views/ReadinessView'
import { RoadmapView } from '@/components/views/RoadmapView'
import { SkillsView } from '@/components/views/SkillsView'
import { SchemesView } from '@/components/views/SchemesView'
import { ResourcesView } from '@/components/views/ResourcesView'
import { SafetyView } from '@/components/views/SafetyView'
import { OpportunitiesView } from '@/components/views/OpportunitiesView'
import { CompetitionView } from '@/components/views/CompetitionView'
import { ProfileView } from '@/components/views/ProfileView'

export type Lang = 'en' | 'hi' | 'mr' | 'bn' | 'ta' | 'te' | 'gu' | 'kn' | 'ml' | 'pa'
export type Section =
  | 'home'
  | 'discover'
  | 'readiness'
  | 'roadmap'
  | 'skills'
  | 'schemes'
  | 'resources'
  | 'safety'
  | 'opportunities'
  | 'competition'
  | 'profile'

export const languages: { id: Lang; label: string; native: string }[] = [
  { id: 'en', label: 'English', native: 'English' },
  { id: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { id: 'mr', label: 'Marathi', native: 'मराठी' },
  { id: 'bn', label: 'Bengali', native: 'বাংলা' },
  { id: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { id: 'te', label: 'Telugu', native: 'తెలుగు' },
  { id: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { id: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { id: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { id: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
]

export const copy: Record<Lang, Record<string, string>> = {
  en: { home: 'Dashboard', discover: 'Passion Finder', readiness: 'Career Readiness', roadmap: 'Career Roadmap', skills: 'Build Skills', schemes: 'Government Schemes', resources: 'Trusted Resources', safety: 'Stay Safe', opportunities: 'Near You', competition: 'Competition', profile: 'My Profile', greeting: 'Good evening', welcome: "Let's take one step closer to your career goal.", hero: 'Your career journey starts here', heroSub: 'Discover careers that match your interests, understand the skills you need, and find trusted opportunities.', start: 'Find your career path', explore: 'Explore careers', next: 'Your next step', nextSub: 'Build your first verified skills project', continue: 'Continue learning', match: 'Career match', readinessCard: 'Career readiness', progress: 'Roadmap progress', resourcesCard: 'Recommended learning', discoverTitle: 'Find your direction', discoverSub: 'Answer 10 simple questions and discover careers that truly suit your interests.', question: 'What type of work do you enjoy?', assessment: 'Question', results: 'Your top career matches', roadmapTitle: 'Your career roadmap', skillsTitle: 'Build skills that open doors', schemesTitle: 'Government scheme checker', resourcesTitle: 'Trusted career resources', safetyTitle: 'Stay safe from career scams', opportunitiesTitle: 'Opportunities near you', competitionTitle: 'Understand competition', profileTitle: 'Build your career profile', official: 'Official source', trusted: 'Trusted resource', view: 'View details', save: 'Save profile', nextStep: 'Next step' },
  hi: { home: 'डैशबोर्ड', discover: 'रुचि खोजें', readiness: 'करियर तैयारी', roadmap: 'करियर रोडमैप', skills: 'कौशल बनाएं', schemes: 'सरकारी योजनाएं', resources: 'विश्वसनीय संसाधन', safety: 'सुरक्षित रहें', opportunities: 'आपके पास', competition: 'प्रतियोगिता', profile: 'मेरी प्रोफाइल', greeting: 'शुभ संध्या', welcome: 'अपने करियर लक्ष्य की ओर एक कदम और बढ़ें।', hero: 'आपकी करियर यात्रा यहीं से शुरू होती है', heroSub: 'अपनी रुचि से मेल खाते करियर खोजें, जरूरी कौशल समझें और भरोसेमंद अवसर पाएं।', start: 'अपना करियर पथ खोजें', explore: 'करियर देखें', next: 'आपका अगला कदम', nextSub: 'अपना पहला कौशल प्रोजेक्ट बनाएं', continue: 'सीखना जारी रखें', match: 'करियर मिलान', readinessCard: 'करियर तैयारी', progress: 'रोडमैप प्रगति', resourcesCard: 'अनुशंसित सीखना', discoverTitle: 'अपनी दिशा खोजें', discoverSub: '10 आसान सवालों के जवाब दें और अपने लिए उपयुक्त करियर खोजें।', question: 'आपको किस तरह का काम पसंद है?', assessment: 'सवाल', results: 'आपके शीर्ष करियर', roadmapTitle: 'आपका करियर रोडमैप', skillsTitle: 'कौशल बनाएं, अवसर पाएं', schemesTitle: 'सरकारी योजना जांचक', resourcesTitle: 'विश्वसनीय करियर संसाधन', safetyTitle: 'करियर धोखाधड़ी से सुरक्षित रहें', opportunitiesTitle: 'आपके पास अवसर', competitionTitle: 'प्रतियोगिता समझें', profileTitle: 'अपनी करियर प्रोफाइल बनाएं', official: 'आधिकारिक स्रोत', trusted: 'विश्वसनीय संसाधन', view: 'विवरण देखें', save: 'प्रोफाइल सेव करें', nextStep: 'अगला कदम' },
  mr: { home: 'डॅशबोर्ड', discover: 'आवड शोधा', readiness: 'करिअर तयारी', roadmap: 'करिअर रोडमॅप', skills: 'कौशल्ये वाढवा', schemes: 'सरकारी योजना', resources: 'विश्वसनीय संसाधने', safety: 'सुरक्षित रहा', opportunities: 'तुमच्या जवळ', competition: 'स्पर्धा', profile: 'माझी प्रोफाइल', greeting: 'शुभ संध्याकाळ', welcome: 'तुमच्या करिअरच्या ध्येयाच्या दिशेने आणखी एक पाऊल टाका.', hero: 'तुमचा करिअर प्रवास इथून सुरू होतो', heroSub: 'तुमच्या आवडीशी जुळणारे करिअर शोधा, आवश्यक कौशल्ये समजून घ्या आणि विश्वासार्ह संधी मिळवा.', start: 'तुमचा करिअर मार्ग शोधा', explore: 'करिअर पहा', next: 'तुमची पुढील पायरी', nextSub: 'तुमचा पहिला कौशल्य प्रकल्प तयार करा', continue: 'शिकणे सुरू ठेवा', match: 'करिअर जुळणी', readinessCard: 'करिअर तयारी', progress: 'रोडमॅप प्रगती', resourcesCard: 'शिफारस केलेले शिक्षण', discoverTitle: 'तुमची दिशा शोधा', discoverSub: '10 सोप्या प्रश्नांची उत्तरे द्या आणि तुमच्यासाठी योग्य करिअर शोधा.', question: 'तुम्हाला कोणत्या प्रकारचे काम आवडते?', assessment: 'प्रश्न', results: 'तुमच्यासाठी योग्य करिअर', roadmapTitle: 'तुमचा करिअर रोडमॅप', skillsTitle: 'कौशल्ये वाढवा, संधी मिळवा', schemesTitle: 'सरकारी योजना तपासक', resourcesTitle: 'विश्वासार्ह करिअर संसाधने', safetyTitle: 'करिअर फसवणुकीपासून सुरक्षित रहा', opportunitiesTitle: 'तुमच्या जवळील संधी', competitionTitle: 'स्पर्धा समजून घ्या', profileTitle: 'तुमची करिअर प्रोफाइल तयार करा', official: 'अधिकृत स्रोत', trusted: 'विश्वासार्ह संसाधन', view: 'तपशील पहा', save: 'प्रोफाइल जतन करा', nextStep: 'पुढील पायरी' },
  bn: { home: 'ড্যাশবোর্ড', discover: 'আগ্রহ খুঁজুন', readiness: 'ক্যারিয়ার প্রস্তুতি', roadmap: 'ক্যারিয়ার রোডম্যাপ', skills: 'দক্ষতা তৈরি করুন', schemes: 'সরকারি প্রকল্প', resources: 'বিশ্বস্ত সম্পদ', safety: 'নিরাপদ থাকুন', opportunities: 'আপনার কাছে', competition: 'প্রতিযোগিতা', profile: 'আমার প্রোফাইল', greeting: 'শুভ সন্ধ্যা', welcome: 'আপনার ক্যারিয়ার লক্ষ্যের দিকে আরও এক ধাপ এগিয়ে যান।', hero: 'আপনার ক্যারিয়ার যাত্রা এখানেই শুরু', heroSub: 'আপনার আগ্রহের সাথে মেলে এমন ক্যারিয়ার খুঁজুন এবং বিশ্বস্ত সুযোগ পান।', start: 'আপনার ক্যারিয়ার পথ খুঁজুন', explore: 'ক্যারিয়ার দেখুন', next: 'আপনার পরবর্তী পদক্ষেপ', nextSub: 'আপনার প্রথম প্রকল্প তৈরি করুন', continue: 'শেখা চালিয়ে যান', match: 'ক্যারিয়ার মিল', readinessCard: 'ক্যারিয়ার প্রস্তুতি', progress: 'রোডম্যাপ অগ্রগতি', resourcesCard: 'প্রস্তাবিত শেখা', discoverTitle: 'আপনার দিক খুঁজুন', discoverSub: '10টি সহজ প্রশ্নের উত্তর দিন।', question: 'আপনি কী ধরনের কাজ উপভোগ করেন?', assessment: 'প্রশ্ন', results: 'আপনার সেরা ক্যারিয়ার', roadmapTitle: 'আপনার ক্যারিয়ার রোডম্যাপ', skillsTitle: 'দক্ষতা তৈরি করুন', schemesTitle: 'সরকারি প্রকল্প পরীক্ষক', resourcesTitle: 'বিশ্বস্ত ক্যারিয়ার সম্পদ', safetyTitle: 'ক্যারিয়ার জালিয়াতি থেকে নিরাপদ থাকুন', opportunitiesTitle: 'আপনার কাছের সুযোগ', competitionTitle: 'প্রতিযোগিতা বুঝুন', profileTitle: 'আপনার ক্যারিয়ার প্রোফাইল তৈরি করুন', official: 'সরকারি উৎস', trusted: 'বিশ্বস্ত সম্পদ', view: 'বিস্তারিত দেখুন', save: 'প্রোফাইল সংরক্ষণ', nextStep: 'পরবর্তী পদক্ষেপ' },
  ta: { home: 'டாஷ்போர்டு', discover: 'ஆர்வத்தைக் கண்டறி', readiness: 'தொழில் தயார்நிலை', roadmap: 'தொழில் பாதை', skills: 'திறன்களை வளர்க்க', schemes: 'அரசுத் திட்டங்கள்', resources: 'நம்பகமான வளங்கள்', safety: 'பாதுகாப்பாக இருங்கள்', opportunities: 'உங்கள் அருகில்', competition: 'போட்டி', profile: 'என் சுயவிவரம்', greeting: 'மாலை வணக்கம்', welcome: 'உங்கள் தொழில் இலக்கை நோக்கி இன்னொரு படி செல்லுங்கள்.', hero: 'உங்கள் தொழில் பயணம் இங்கே தொடங்குகிறது', heroSub: 'உங்கள் ஆர்வத்திற்குப் பொருந்தும் தொழில்களையும் நம்பகமான வாய்ப்புகளையும் கண்டறியுங்கள்.', start: 'தொழில் பாதையைக் கண்டறி', explore: 'தொழில்களை ஆராய்', next: 'உங்கள் அடுத்த படி', nextSub: 'உங்கள் முதல் திட்டத்தை உருவாக்குங்கள்', continue: 'கற்றலைத் தொடருங்கள்', match: 'தொழில் பொருத்தம்', readinessCard: 'தொழில் தயார்நிலை', progress: 'பாதை முன்னேற்றம்', resourcesCard: 'பரிந்துரைக்கப்பட்ட கற்றல்', discoverTitle: 'உங்கள் திசையைக் கண்டறியுங்கள்', discoverSub: '10 எளிய கேள்விகளுக்கு பதிலளியுங்கள்.', question: 'எந்த வகையான வேலையை நீங்கள் விரும்புகிறீர்கள்?', assessment: 'கேள்வி', results: 'உங்கள் சிறந்த தொழில்கள்', roadmapTitle: 'உங்கள் தொழில் பாதை', skillsTitle: 'திறன்களை வளர்த்துக் கொள்ளுங்கள்', schemesTitle: 'அரசுத் திட்ட சரிபார்ப்பு', resourcesTitle: 'நம்பகமான தொழில் வளங்கள்', safetyTitle: 'தொழில் மோசடிகளில் இருந்து பாதுகாப்பாக இருங்கள்', opportunitiesTitle: 'உங்கள் அருகிலுள்ள வாய்ப்புகள்', competitionTitle: 'போட்டியைப் புரிந்துகொள்ளுங்கள்', profileTitle: 'உங்கள் தொழில் சுயவிவரத்தை உருவாக்குங்கள்', official: 'அதிகாரப்பூர்வ ஆதாரம்', trusted: 'நம்பகமான வளம்', view: 'விவரங்களைக் காண்க', save: 'சுயவிவரத்தைச் சேமி', nextStep: 'அடுத்த படி' },
  te: { home: 'డాష్‌బోర్డ్', discover: 'ఆసక్తిని కనుగొనండి', readiness: 'కెరీర్ సిద్ధత', roadmap: 'కెరీర్ రోడ్‌మ్యాప్', skills: 'నైపుణ్యాలను పెంచుకోండి', schemes: 'ప్రభుత్వ పథకాలు', resources: 'విశ్వసనీయ వనరులు', safety: 'సురక్షితంగా ఉండండి', opportunities: 'మీ దగ్గర', competition: 'పోటీ', profile: 'నా ప్రొఫైల్', greeting: 'శుభ సాయంత్రం', welcome: 'మీ కెరీర్ లక్ష్యం వైపు మరో అడుగు వేయండి.', hero: 'మీ కెరీర్ ప్రయాణం ఇక్కడ ప్రారంభమవుతుంది', heroSub: 'మీ ఆసక్తులకు సరిపోయే కెరీర్‌లను కనుగొని, నమ్మకమైన అవకాశాలను పొందండి.', start: 'మీ కెరీర్ మార్గాన్ని కనుగొనండి', explore: 'కెరీర్‌లను చూడండి', next: 'మీ తదుపరి అడుగు', nextSub: 'మీ మొదటి ప్రాజెక్ట్‌ను రూపొందించండి', continue: 'నేర్చుకోవడం కొనసాగించండి', match: 'కెరీర్ మ్యాచ్', readinessCard: 'కెరీర్ సిద్ధత', progress: 'రోడ్‌మ్యాప్ పురోగతి', resourcesCard: 'సిఫార్సు చేసిన అభ్యాసం', discoverTitle: 'మీ దిశను కనుగొనండి', discoverSub: '10 సులభమైన ప్రశ్నలకు సమాధానం ఇవ్వండి.', question: 'మీకు ఎలాంటి పని ఇష్టం?', assessment: 'ప్రశ్న', results: 'మీ అగ్ర కెరీర్ మ్యాచ్‌లు', roadmapTitle: 'మీ కెరీర్ రోడ్‌మ్యాప్', skillsTitle: 'అవకాశాల కోసం నైపుణ్యాలను పెంచుకోండి', schemesTitle: 'ప్రభుత్వ పథక తనిఖీ', resourcesTitle: 'నమ్మకమైన కెరీర్ వనరులు', safetyTitle: 'కెరీర్ మోసాల నుండి సురక్షితంగా ఉండండి', opportunitiesTitle: 'మీ సమీపంలోని అవకాశాలు', competitionTitle: 'పోటీని అర్థం చేసుకోండి', profileTitle: 'మీ కెరీర్ ప్రొఫైల్‌ను రూపొందించండి', official: 'అధికారిక మూలం', trusted: 'నమ్మకమైన వనరు', view: 'விவரాలు చూడండి', save: 'ప్రొఫైల్ సేవ్ చేయండి', nextStep: 'తదుపరి అడుగు' },
  gu: { home: 'ડેશબોર્ડ', discover: 'રુચિ શોધો', readiness: 'કારકિર્દી તૈયારી', roadmap: 'કારકિર્દી માર્ગ', skills: 'કૌશલ્યો બનાવો', schemes: 'સરકારી યોજનાઓ', resources: 'વિશ્વસનીય સંસાધનો', safety: 'સુરક્ષિત રહો', opportunities: 'તમારી નજીક', competition: 'સ્પર્ધા', profile: 'મારી પ્રોફાઇલ', greeting: 'શુભ સાંજ', welcome: 'તમારા કારકિર્દી લક્ષ્ય તરફ એક પગલું આગળ વધો.', hero: 'તમારી કારકિર્દીની સફર અહીંથી શરૂ થાય છે', heroSub: 'તમારી રુચિ સાથે મેળ ખાતી કારકિર્દી અને વિશ્વસનીય તકો શોધો.', start: 'તમારો કારકિર્દી માર્ગ શોધો', explore: 'કારકિર્દી જુઓ', next: 'તમારું આગલું પગલું', nextSub: 'તમારો પ્રથમ પ્રોજેક્ટ બનાવો', continue: 'શીખવાનું ચાલુ રાખો', match: 'કારકિર્દી મેચ', readinessCard: 'કારકિર્દી તૈયારી', progress: 'માર્ગની પ્રગતિ', resourcesCard: 'ભલામણ કરેલ શિક્ષણ', discoverTitle: 'તમારી દિશા શોધો', discoverSub: '10 સરળ પ્રશ્નોના જવાબ આપો.', question: 'તમને કેવા પ્રકારનું કામ ગમે છે?', assessment: 'પ્રશ્ન', results: 'તમારી શ્રેષ્ઠ કારકિર્દી', roadmapTitle: 'તમારો કારકિર્દી માર્ગ', skillsTitle: 'કૌશલ્યો બનાવો, તકો મેળવો', schemesTitle: 'સરકારી યોજના તપાસક', resourcesTitle: 'વિશ્વસનીય કારકિર્દી સંસાધનો', safetyTitle: 'કારકિર્દી કૌભાંડોથી સુરક્ષિત રહો', opportunitiesTitle: 'તમારી નજીકની તકો', competitionTitle: 'સ્પર્ધા સમજો', profileTitle: 'તમારી કારકિર્દી પ્રોફાઇલ બનાવો', official: 'સત્તાવાર સ્ત્રોત', trusted: 'વિશ્વસનીય સંસાધન', view: 'વિગતો જુઓ', save: 'પ્રોફાઇલ સાચવો', nextStep: 'આગલું પગલું' },
  kn: { home: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', discover: 'ಆಸಕ್ತಿ ಹುಡುಕಿ', readiness: 'ವೃತ್ತಿ ಸಿದ್ಧತೆ', roadmap: 'ವೃತ್ತಿ ಮಾರ್ಗ', skills: 'ಕೌಶಲ್ಯ ಬೆಳೆಸಿ', schemes: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು', resources: 'ವಿಶ್ವಾಸಾರ್ಹ ಸಂಪನ್ಮೂಲಗಳು', safety: 'ಸುರಕ್ಷಿತವಾಗಿರಿ', opportunities: 'ನಿಮ್ಮ ಹತ್ತಿರ', competition: 'ಸ್ಪರ್ಧೆ', profile: 'ನನ್ನ ಪ್ರೊಫೈಲ್', greeting: 'ಶುಭ ಸಂಜೆ', welcome: 'ನಿಮ್ಮ ವೃತ್ತಿ ಗುರಿಯತ್ತ ಇನ್ನೊಂದು ಹೆಜ್ಜೆ ಇಡಿ.', hero: 'ನಿಮ್ಮ ವೃತ್ತಿ ಪ್ರಯಾಣ ಇಲ್ಲಿಂದ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ', heroSub: 'ನಿಮ್ಮ ಆಸಕ್ತಿಗಳಿಗೆ ಹೊಂದುವ ವೃತ್ತಿಗಳನ್ನು ಮತ್ತು ವಿಶ್ವಾಸಾರ್ಹ ಅವಕಾಶಗಳನ್ನು ಹುಡುಕಿ.', start: 'ನಿಮ್ಮ ವೃತ್ತಿ ಮಾರ್ಗ ಹುಡುಕಿ', explore: 'ವೃತ್ತಿಗಳನ್ನು ಅನ್ವೇಷಿಸಿ', next: 'ನಿಮ್ಮ ಮುಂದಿನ ಹೆಜ್ಜೆ', nextSub: 'ನಿಮ್ಮ ಮೊದಲ ಪ್ರಾಜೆಕ್ಟ್ ನಿರ್ಮಿಸಿ', continue: 'ಕಲಿಯುವುದನ್ನು ಮುಂದುವರಿಸಿ', match: 'ವೃತ್ತಿ ಹೊಂದಾಣಿಕೆ', readinessCard: 'ವೃತ್ತಿ ಸಿದ್ಧತೆ', progress: 'ಮಾರ್ಗದ ಪ್ರಗತಿ', resourcesCard: 'ಶಿಫಾರಸು ಮಾಡಿದ ಕಲಿಕೆ', discoverTitle: 'ನಿಮ್ಮ ದಿಕ್ಕು ಹುಡುಕಿ', discoverSub: '10 ಸರಳ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ.', question: 'ನೀವು ಯಾವ ರೀತಿಯ ಕೆಲಸವನ್ನು ಇಷ್ಟಪಡುತ್ತೀರಿ?', assessment: 'ಪ್ರಶ್ನೆ', results: 'ನಿಮ್ಮ ಉನ್ನತ ವೃತ್ತಿ ಹೊಂದಾಣಿಕೆಗಳು', roadmapTitle: 'ನಿಮ್ಮ ವೃತ್ತಿ ಮಾರ್ಗ', skillsTitle: 'ಅವಕಾಶಗಳಿಗಾಗಿ ಕೌಶಲ್ಯ ಬೆಳೆಸಿ', schemesTitle: 'ಸರ್ಕಾರಿ ಯೋಜನೆ ಪರಿಶೀಲನೆ', resourcesTitle: 'ವಿಶ್ವಾಸಾರ್ಹ ವೃತ್ತಿ ಸಂಪನ್ಮೂಲಗಳು', safetyTitle: 'ವೃತ್ತಿ ವಂಚನೆಗಳಿಂದ ಸುರಕ್ಷಿತರಾಗಿರಿ', opportunitiesTitle: 'ನಿಮ್ಮ ಹತ್ತಿರದ ಅವಕಾಶಗಳು', competitionTitle: 'ಸ್ಪರ್ಧೆ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ', profileTitle: 'ನಿಮ್ಮ ವೃತ್ತಿ ಪ್ರೊಫೈಲ್ ರಚಿಸಿ', official: 'ಅಧಿಕೃತ ಮೂಲ', trusted: 'ವಿಶ್ವಾಸಾರ್ಹ ಸಂಪನ್ಮೂಲ', view: 'ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ', save: 'ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ', nextStep: 'ಮುಂದಿನ ಹೆಜ್ಜೆ' },
  ml: { home: 'ഡാഷ്ബോർഡ്', discover: 'താൽപ്പര്യം കണ്ടെത്തുക', readiness: 'കരിയർ തയ്യാറെടുപ്പ്', roadmap: 'കരിയർ റോഡ്മാപ്പ്', skills: 'കഴിവുകൾ വളർത്തുക', schemes: 'സർക്കാർ പദ്ധതികൾ', resources: 'വിശ്വസനീയ വിഭവങ്ങൾ', safety: 'സുരക്ഷിതരായിരിക്കുക', opportunities: 'നിങ്ങളുടെ അടുത്ത്', competition: 'മത്സരം', profile: 'എന്റെ പ്രൊഫൈൽ', greeting: 'ശുഭ സായാഹ്നം', welcome: 'നിങ്ങളുടെ കരിയർ ലക്ഷ്യത്തിലേക്ക് ഒരു ചുവട് കൂടി.', hero: 'നിങ്ങളുടെ കരിയർ യാത്ര ഇവിടെ തുടങ്ങുന്നു', heroSub: 'നിങ്ങളുടെ താൽപ്പര്യങ്ങളുമായി പൊരുത്തപ്പെടുന്ന കരിയറുകളും വിശ്വസനീയമായ അവസരങ്ങളും കണ്ടെത്തുക.', start: 'നിങ്ങളുടെ കരിയർ പാത കണ്ടെത്തുക', explore: 'കരിയറുകൾ പര്യവേക്ഷണം ചെയ്യുക', next: 'നിങ്ങളുടെ അടുത്ത ചുവട്', nextSub: 'നിങ്ങളുടെ ആദ്യ പ്രോജക്റ്റ് നിർമ്മിക്കുക', continue: 'പഠനം തുടരുക', match: 'കരിയർ പൊരുത്തം', readinessCard: 'കരിയർ തയ്യാറെടുപ്പ്', progress: 'റോഡ്മാപ്പ് പുരോഗതി', resourcesCard: 'ശുപാർശ ചെയ്ത പഠനം', discoverTitle: 'നിങ്ങളുടെ ദിശ കണ്ടെത്തുക', discoverSub: '10 ലളിതമായ ചോദ്യങ്ങൾക്ക് ഉത്തരം നൽകുക.', question: 'ഏത് തരത്തിലുള്ള ജോലി നിങ്ങൾ ആസ്വദിക്കുന്നു?', assessment: 'ചോദ്യം', results: 'നിങ്ങളുടെ മികച്ച കരിയർ പൊരുത്തങ്ങൾ', roadmapTitle: 'നിങ്ങളുടെ കരിയർ റോഡ്മാപ്പ്', skillsTitle: 'അവസരങ്ങൾക്കായി കഴിവുകൾ വളർത്തുക', schemesTitle: 'സർക്കാർ പദ്ധതി പരിശോധകൻ', resourcesTitle: 'വിശ്വസനീയ കരിയർ വിഭവങ്ങൾ', safetyTitle: 'കരിയർ തട്ടിപ്പുകളിൽ നിന്ന് സുരക്ഷിതരാകുക', opportunitiesTitle: 'നിങ്ങളുടെ അടുത്തുള്ള അവസരങ്ങൾ', competitionTitle: 'മത്സരം മനസ്സിലാക്കുക', profileTitle: 'നിങ്ങളുടെ കരിയർ പ്രൊഫൈൽ നിർമ്മിക്കുക', official: 'ഔദ്യോഗിക ഉറവിടം', trusted: 'വിശ്വസനീയ വിഭവം', view: 'വിശദാംശങ്ങൾ കാണുക', save: 'പ്രൊഫൈൽ സംരക്ഷിക്കുക', nextStep: 'അടുത്ത ചുവട്' },
  pa: { home: 'ਡੈਸ਼ਬੋਰਡ', discover: 'ਦਿਲਚਸਪੀ ਲੱਭੋ', readiness: 'ਕੈਰੀਅਰ ਤਿਆਰੀ', roadmap: 'ਕੈਰੀਅਰ ਮਾਰਗ', skills: 'ਹੁਨਰ ਬਣਾਓ', schemes: 'ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ', resources: 'ਭਰੋਸੇਯੋਗ ਸਰੋਤ', safety: 'ਸੁਰੱਖਿਅਤ ਰਹੋ', opportunities: 'ਤੁਹਾਡੇ ਨੇੜੇ', competition: 'ਮੁਕਾਬਲਾ', profile: 'ਮੇਰੀ ਪ੍ਰੋਫਾਈਲ', greeting: 'ਸ਼ੁਭ ਸ਼ਾਮ', welcome: 'ਆਪਣੇ ਕੈਰੀਅਰ ਟੀਚੇ ਵੱਲ ਇੱਕ ਹੋਰ ਕਦਮ ਚੁੱਕੋ।', hero: 'ਤੁਹਾਡੀ ਕੈਰੀਅਰ ਯਾਤਰਾ ਇੱਥੇ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ', heroSub: 'ਆਪਣੀਆਂ ਰੁਚੀਆਂ ਨਾਲ ਮੇਲ ਖਾਂਦੇ ਕੈਰੀਅਰ ਅਤੇ ਭਰੋਸੇਯੋਗ ਮੌਕੇ ਲੱਭੋ।', start: 'ਆਪਣਾ ਕੈਰੀਅਰ ਮਾਰਗ ਲੱਭੋ', explore: 'ਕੈਰੀਅਰ ਵੇਖੋ', next: 'ਤੁਹਾਡਾ ਅਗਲਾ ਕਦਮ', nextSub: 'ਆਪਣਾ ਪਹਿਲਾ ਪ੍ਰੋਜੈਕਟ ਬਣਾਓ', continue: 'ਸਿੱਖਣਾ ਜਾਰੀ ਰੱਖੋ', match: 'ਕੈਰੀਅਰ ਮੇਲ', readinessCard: 'ਕੈਰੀਅਰ ਤਿਆਰੀ', progress: 'ਮਾਰਗ ਦੀ ਤਰੱਕੀ', resourcesCard: 'ਸਿਫ਼ਾਰਸ਼ੀ ਸਿੱਖਿਆ', discoverTitle: 'ਆਪਣੀ ਦਿਸ਼ਾ ਲੱਭੋ', discoverSub: '10 ਸਧਾਰਨ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਦਿਓ।', question: 'ਤੁਹਾਨੂੰ ਕਿਸ ਤਰ੍ਹਾਂ ਦਾ ਕੰਮ ਪਸੰਦ ਹੈ?', assessment: 'ਸਵਾਲ', results: 'ਤੁਹਾਡੇ ਪ੍ਰਮੁੱਖ ਕੈਰੀਅਰ', roadmapTitle: 'ਤੁਹਾਡਾ ਕੈਰੀਅਰ ਮਾਰਗ', skillsTitle: 'ਮੌਕਿਆਂ ਲਈ ਹੁਨਰ ਬਣਾਓ', schemesTitle: 'ਸਰਕਾਰੀ ਯੋਜਨਾ ਜਾਂਚਕ', resourcesTitle: 'ਭਰੋਸੇਯੋਗ ਕੈਰੀਅਰ ਸਰੋਤ', safetyTitle: 'ਕੈਰੀਅਰ ਧੋਖਾਧੜੀ ਤੋਂ ਸੁਰੱਖਿਅਤ ਰਹੋ', opportunitiesTitle: 'ਤੁਹਾਡੇ ਨੇੜੇ ਦੇ ਮੌਕੇ', competitionTitle: 'ਮੁਕਾਬਲਾ ਸਮਝੋ', profileTitle: 'ਆਪਣੀ ਕੈਰੀਅਰ ਪ੍ਰੋਫਾਈਲ ਬਣਾਓ', official: 'ਅਧਿਕਾਰਤ ਸਰੋਤ', trusted: 'ਭਰੋਸੇਯੋਗ ਸਰੋਤ', view: 'ਵੇਰਵੇ ਵੇਖੋ', save: 'ਪ੍ਰੋਫਾਈਲ ਸੇਵ ਕਰੋ', nextStep: 'ਅਗਲਾ ਕਦਮ' },
}

const nav = [
  ['home', Home],
  ['discover', Target],
  ['readiness', BarChart3],
  ['roadmap', Compass],
  ['skills', BookOpen],
  ['schemes', GraduationCap],
  ['resources', ShieldCheck],
  ['safety', CircleAlert],
  ['opportunities', MapPin],
  ['competition', TrendingUp],
  ['profile', UserRound],
] as const

export function CareerSetuApp({ initialSection = 'home' }: { initialSection?: Section }) {
  const searchParams = useSearchParams()
  const { user, authenticated, logout } = useAuth()

  const [lang, setLang] = useState<Lang>('en')
  const [section, setSection] = useState<Section>(initialSection)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedCareer, setSelectedCareer] = useState<string>('software-developer')
  const [profileSaved, setProfileSaved] = useState(false)
  const [userLocation, setUserLocation] = useState('Nashik, Maharashtra')

  // Check URL query parameter ?section=...
  useEffect(() => {
    const s = searchParams.get('section') as Section | null
    if (s && nav.some(([id]) => id === s)) {
      setSection(s)
    }
  }, [searchParams])

  // Load user profile location
  useEffect(() => {
    async function checkLocation() {
      try {
        const res = await fetch('/api/profile')
        if (res.ok) {
          const data = await res.json()
          const p = data.data?.profile || data.profile
          if (p?.district || p?.state) {
            setUserLocation(`${p.district || ''}${p.district && p.state ? ', ' : ''}${p.state || ''}`)
          }
        }
      } catch (err) {
        // Fallback default
      }
    }
    if (authenticated) {
      checkLocation()
    }
  }, [authenticated])

  const t = copy[lang]
  const currentLanguage = languages.find((item) => item.id === lang)

  const go = (next: Section) => {
    setSection(next)
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navItems = useMemo(
    () => nav.map(([id, Icon]) => ({ id: id as Section, Icon, label: t[id] })),
    [t]
  )

  const avatarInitial = user?.name ? user.name.trim().charAt(0).toUpperCase() : 'M'

  // Format today's date
  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <main className="min-h-screen bg-[#f6faf9] text-slate-900">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-7">
          <div className="grid size-10 place-items-center rounded-2xl bg-teal-600 text-xl font-black text-white shadow-xs">
            C
          </div>
          <div>
            <div className="text-xl font-black tracking-tight text-slate-900">
              Career<span className="text-teal-600">Setu</span>
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-[.18em] text-slate-400">
              Your path, made clear
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
          {navItems.map(({ id, Icon, label }) => (
            <button
              key={id}
              onClick={() => go(id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                section === id
                  ? 'bg-teal-50 text-teal-700 font-bold'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={18} strokeWidth={section === id ? 2.5 : 2} />
              {label}
            </button>
          ))}
        </nav>

        {/* Bottom Card / Auth Controls */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          {authenticated && user ? (
            <div className="rounded-2xl bg-slate-50 p-3 flex items-center justify-between">
              <button
                onClick={() => go('profile')}
                className="flex items-center gap-2.5 text-left hover:opacity-80 transition"
              >
                <div className="grid size-8 place-items-center rounded-xl bg-orange-400 text-xs font-black text-slate-950">
                  {avatarInitial}
                </div>
                <div className="max-w-[100px] truncate">
                  <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                  <p className="text-[10px] font-medium text-slate-400 capitalize">{user.role}</p>
                </div>
              </button>

              <button
                onClick={logout}
                title="Sign out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/login"
                className="flex-1 rounded-xl border border-slate-200 py-2 text-center text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="flex-1 rounded-xl bg-teal-600 py-2 text-center text-xs font-bold text-white hover:bg-teal-700 transition"
              >
                Sign Up
              </Link>
            </div>
          )}

          <div className="rounded-2xl bg-orange-50 p-3.5">
            <div className="mb-1.5 flex items-center gap-2 text-orange-800">
              <Sparkles size={15} />
              <span className="text-xs font-bold">Keep moving forward</span>
            </div>
            <p className="text-[11px] leading-4 text-orange-700">
              Small steps today create big opportunities tomorrow.
            </p>
          </div>
        </div>
      </aside>

      {/* Top Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:ml-64 lg:px-10">
        <button
          className="rounded-xl p-2 hover:bg-slate-100 lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Open navigation"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className="ml-2 flex items-center gap-2 lg:hidden">
          <div className="grid size-8 place-items-center rounded-xl bg-teal-600 text-sm font-black text-white">
            C
          </div>
          <span className="font-black text-slate-900">
            Career<span className="text-teal-600">Setu</span>
          </span>
        </div>

        <div className="hidden items-center gap-2 text-sm text-slate-500 lg:flex">
          <span>{todayFormatted}</span>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-700">{userLocation}</span>
        </div>

        <div className="relative ml-auto flex items-center gap-3">
          {/* Language Selector */}
          <button
            onClick={() => setLanguageOpen(!languageOpen)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            <Languages size={17} className="text-teal-600" />
            {currentLanguage?.native}
            <ChevronDown size={14} />
          </button>

          {languageOpen && (
            <div className="absolute right-0 top-12 z-50 grid max-h-96 w-64 grid-cols-2 gap-1 overflow-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              {languages.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setLang(item.id)
                    setLanguageOpen(false)
                  }}
                  className={`rounded-xl px-3 py-2 text-left text-sm hover:bg-teal-50 ${
                    lang === item.id ? 'bg-teal-50 font-bold text-teal-700' : 'text-slate-600'
                  }`}
                >
                  {item.native}
                  <span className="ml-1 text-xs text-slate-400">{item.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Profile / Auth Avatar */}
          {authenticated ? (
            <button
              onClick={() => go('profile')}
              title="View Profile"
              className="grid size-9 place-items-center rounded-xl bg-orange-100 font-bold text-orange-700 hover:bg-orange-200 transition"
            >
              {avatarInitial}
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-teal-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-700 transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <nav
            className="h-full w-72 bg-white p-4 pt-20 shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {navItems.map(({ id, Icon, label }) => (
              <button
                key={id}
                onClick={() => go(id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold ${
                  section === id ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-600'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}

            {authenticated && (
              <button
                onClick={logout}
                className="mt-6 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            )}
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <div className="lg:ml-64">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          {section === 'home' && <HomeView t={t} go={go} />}
          {section === 'discover' && (
            <DiscoverView
              t={t}
              go={go}
              onSelectCareer={(slug) => {
                setSelectedCareer(slug)
              }}
            />
          )}
          {section === 'readiness' && (
            <ReadinessView t={t} selectedCareerSlug={selectedCareer} />
          )}
          {section === 'roadmap' && (
            <RoadmapView t={t} selectedCareerSlug={selectedCareer} />
          )}
          {section === 'skills' && <SkillsView t={t} />}
          {section === 'schemes' && <SchemesView t={t} />}
          {section === 'resources' && <ResourcesView t={t} />}
          {section === 'safety' && <SafetyView t={t} />}
          {section === 'opportunities' && (
            <OpportunitiesView t={t} district={userLocation} />
          )}
          {section === 'competition' && <CompetitionView t={t} />}
          {section === 'profile' && (
            <ProfileView t={t} saved={profileSaved} setSaved={setProfileSaved} />
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-20 flex justify-around border-t border-slate-200 bg-white px-2 py-2 lg:hidden">
        {navItems.slice(0, 5).map(({ id, Icon, label }) => (
          <button
            key={id}
            onClick={() => go(id)}
            className={`flex min-w-14 flex-col items-center gap-1 rounded-xl px-2 py-1 text-[10px] font-semibold ${
              section === id ? 'text-teal-700 font-bold' : 'text-slate-400'
            }`}
          >
            <Icon size={18} />
            <span>{label.split(' ')[0]}</span>
          </button>
        ))}
      </div>
    </main>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f6faf9]" />}>
      <CareerSetuApp />
    </Suspense>
  )
}
