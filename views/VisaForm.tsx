import React, { useState, useCallback } from 'react';
import { VisaApplication, FormStep } from '../types';
import { supabase } from '../lib/supabase';
import {
  ChevronRight, ChevronLeft, CheckCircle, Camera, Upload,
  User, Users, Shield, Plane, Globe, Info, RefreshCw,
  AlertCircle, MapPin, X
} from 'lucide-react';
