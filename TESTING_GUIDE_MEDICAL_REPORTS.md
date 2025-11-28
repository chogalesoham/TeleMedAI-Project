# Testing Guide: Medical Report Upload History

## Prerequisites
- Backend server running on `http://localhost:5000`
- Frontend running on `http://localhost:8081`
- MongoDB connected
- AI service running on `http://localhost:8000`

## Test Scenarios

### 1. Upload and Save a Report

**Steps:**
1. Navigate to: `http://localhost:8081/patient-dashboard/report-upload`
2. Select document category (e.g., "Lab Report")
3. Add optional notes
4. Upload a medical document (PDF or image)
5. Click "Start Analysis"
6. Wait for AI analysis to complete
7. Review the analysis results
8. Click "Save to History"

**Expected Results:**
- ✅ File uploads successfully
- ✅ AI analysis displays findings, summary, recommendations
- ✅ "Save to History" button changes to "Saved Successfully"
- ✅ Report appears in "Recent Reports" section below
- ✅ Report shows correct name (fileName)
- ✅ Report shows AI-generated summary

### 2. View Report History

**Steps:**
1. Scroll to "Recent Reports" section
2. Observe the list of saved reports

**Expected Results:**
- ✅ All previously saved reports are displayed
- ✅ Each report shows:
  - Report type (e.g., "Complete Blood Count")
  - Document type badge (e.g., "lab-report")
  - Upload date
  - File name
  - Status badge (Normal/Attention Needed)
  - "View" button

### 3. View Report Details

**Steps:**
1. Click "View" button on any report
2. Review the expanded details

**Expected Results:**
- ✅ Details section expands smoothly
- ✅ Shows complete summary
- ✅ Shows top 3 findings with values
- ✅ "View" button changes to "Close"
- ✅ Click "Close" to collapse details

### 4. API Testing with Postman/cURL

#### Create a Medical Report
```bash
curl -X POST http://localhost:5000/api/medical-reports \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "YOUR_USER_ID",
    "fileName": "Blood_Test_Results.pdf",
    "fileType": "application/pdf",
    "fileSize": 245678,
    "documentType": "lab-report",
    "notes": "Annual checkup",
    "analysis": {
      "report_type": "Complete Blood Count",
      "summary": "All parameters within normal range",
      "findings": [
        {
          "parameter": "Hemoglobin",
          "value": "14.5 g/dL",
          "normal_range": "13.5-17.5 g/dL",
          "status": "Normal"
        }
      ],
      "recommendations": ["Maintain current health routine"],
      "concerns": [],
      "disclaimer": "Consult your doctor"
    }
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Medical report saved successfully",
  "data": {
    "_id": "...",
    "userId": "...",
    "reportMeta": {
      "fileName": "Blood_Test_Results.pdf",
      ...
    },
    "analysis": {
      "summary": "All parameters within normal range",
      ...
    },
    "createdAt": "2025-11-28T...",
    "updatedAt": "2025-11-28T..."
  }
}
```

#### Get User Reports
```bash
curl http://localhost:5000/api/medical-reports/user/YOUR_USER_ID
```

**Expected Response:**
```json
{
  "success": true,
  "count": 5,
  "total": 5,
  "data": [
    {
      "_id": "...",
      "reportMeta": {
        "fileName": "...",
        ...
      },
      "analysis": {
        "summary": "...",
        ...
      }
    }
  ]
}
```

#### Get Report Statistics
```bash
curl http://localhost:5000/api/medical-reports/user/YOUR_USER_ID/stats
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "total": 10,
    "archived": 2,
    "active": 8,
    "byType": [
      { "_id": "lab-report", "count": 5 },
      { "_id": "prescription", "count": 3 },
      { "_id": "imaging", "count": 2 }
    ]
  }
}
```

#### Get Single Report
```bash
curl http://localhost:5000/api/medical-reports/REPORT_ID
```

#### Update Report
```bash
curl -X PUT http://localhost:5000/api/medical-reports/REPORT_ID \
  -H "Content-Type: application/json" \
  -d '{
    "tags": ["important", "annual-checkup"]
  }'
```

#### Archive Report
```bash
curl -X PATCH http://localhost:5000/api/medical-reports/REPORT_ID/archive \
  -H "Content-Type: application/json" \
  -d '{
    "isArchived": true
  }'
```

#### Delete Report
```bash
curl -X DELETE http://localhost:5000/api/medical-reports/REPORT_ID
```

### 5. Database Verification

**MongoDB Query:**
```javascript
// Connect to MongoDB
use telemedai

// View all medical reports
db.medicalreports.find().pretty()

// View reports for specific user
db.medicalreports.find({ userId: ObjectId("YOUR_USER_ID") }).pretty()

// Count reports by type
db.medicalreports.aggregate([
  { $group: { _id: "$reportMeta.documentType", count: { $sum: 1 } } }
])

// Get recent reports
db.medicalreports.find().sort({ createdAt: -1 }).limit(5).pretty()
```

## Troubleshooting

### Issue: Reports not saving
**Check:**
1. Backend server is running
2. MongoDB is connected
3. Check browser console for errors
4. Verify userId is valid
5. Check backend logs

### Issue: Reports not displaying
**Check:**
1. API endpoint is correct (`/api/medical-reports/user/:userId`)
2. User is logged in and userId is available
3. Network tab shows successful response
4. Check data format in response

### Issue: Type errors in frontend
**Check:**
1. All imports are correct
2. Types match between service and component
3. Run `npm run build` to check for TypeScript errors

### Issue: 404 on API calls
**Check:**
1. Routes are registered in `server.js`
2. Backend server restarted after adding routes
3. Correct endpoint URL

## Success Criteria

✅ **Upload Flow:**
- User can upload medical documents
- AI analysis completes successfully
- Report saves to database
- Report appears in history immediately

✅ **Data Storage:**
- Report name (fileName) is stored
- AI summary is stored
- All findings are preserved
- Metadata is complete

✅ **Data Retrieval:**
- All user reports load on page load
- Reports display correct information
- Details expand/collapse properly
- No console errors

✅ **API Functionality:**
- All CRUD operations work
- Filtering and pagination work
- Statistics endpoint returns correct data
- Error handling works properly

## Performance Checks

- [ ] Reports load in < 1 second
- [ ] No memory leaks on repeated uploads
- [ ] Database queries are optimized (indexed)
- [ ] Large report lists paginate properly
- [ ] UI remains responsive during operations

## Security Checks

- [ ] User can only access their own reports
- [ ] Input validation on all fields
- [ ] File size limits enforced
- [ ] SQL injection prevention (MongoDB)
- [ ] XSS prevention in displayed data

## Next Steps After Testing

1. **If tests pass:** Feature is ready for production
2. **If tests fail:** Review error logs and fix issues
3. **Optional enhancements:** Implement features from "Next Steps" section in main documentation

## Test Data Examples

### Sample Lab Report Data
```json
{
  "fileName": "CBC_Test_Nov_2025.pdf",
  "documentType": "lab-report",
  "analysis": {
    "report_type": "Complete Blood Count",
    "summary": "All blood parameters are within normal limits. No abnormalities detected.",
    "findings": [
      { "parameter": "WBC", "value": "7.2", "normal_range": "4.5-11.0", "status": "Normal" },
      { "parameter": "RBC", "value": "4.8", "normal_range": "4.5-5.5", "status": "Normal" },
      { "parameter": "Hemoglobin", "value": "14.5", "normal_range": "13.5-17.5", "status": "Normal" }
    ]
  }
}
```

### Sample X-Ray Data
```json
{
  "fileName": "Chest_XRay_Nov_2025.jpg",
  "documentType": "imaging",
  "analysis": {
    "report_type": "Chest X-Ray",
    "summary": "Clear lung fields. No acute cardiopulmonary abnormality.",
    "findings": [],
    "recommendations": ["Routine follow-up in 1 year"]
  }
}
```
